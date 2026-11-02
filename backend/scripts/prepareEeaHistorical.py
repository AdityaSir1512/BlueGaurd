from pathlib import Path
import json
import hashlib

import geopandas as gpd


DATA_DIR = Path(__file__).resolve().parents[1] / "data" / "eea-marine-litter" / "eea_v_3035_100_k_marine-litter_p_2010-2021_v01_r00"
SOURCE_PATH = DATA_DIR / "ml_wms.gpkg"
OUTPUT_PATH = DATA_DIR / "historical-assessments.geojson"
METADATA_ID = "15389e51-5204-4c6b-b40f-ad4af9a6f590"


def main() -> None:
    source_checksum = hashlib.sha256(SOURCE_PATH.read_bytes()).hexdigest()
    frame = gpd.read_file(SOURCE_PATH, layer="MALT_Potential_problem_area_masked")
    if frame.crs is None:
        raise ValueError("The EEA layer has no CRS")
    if frame.crs.to_epsg() != 3035:
        raise ValueError(f"Expected EPSG:3035, found {frame.crs}")

    frame = frame.to_crs(epsg=4326)
    frame["assessmentClass"] = frame["Class"].fillna("").astype(str).str.strip().replace("", "UNCLASSIFIED")
    frame["source"] = "European Environment Agency"
    frame["sourceDataset"] = "Assessment of marine litter in all four regional seas, 2010-2021"
    frame["sourceMetadataId"] = METADATA_ID
    frame["assessmentStart"] = "2010-01-01"
    frame["assessmentEnd"] = "2021-12-31"
    frame["sourceLicense"] = "CC BY 4.0"
    frame["sourceChecksum"] = source_checksum

    output = json.loads(frame.to_json())
    OUTPUT_PATH.write_text(json.dumps(output), encoding="utf-8")
    print(json.dumps({
        "source": str(SOURCE_PATH),
        "output": str(OUTPUT_PATH),
        "records": len(frame),
        "sourceCrs": "EPSG:3035",
        "outputCrs": "EPSG:4326",
        "geometryTypes": sorted(frame.geometry.geom_type.dropna().unique().tolist()),
        "classes": frame["assessmentClass"].value_counts(dropna=False).to_dict(),
        "sourceChecksum": source_checksum,
    }, indent=2))


if __name__ == "__main__":
    main()
