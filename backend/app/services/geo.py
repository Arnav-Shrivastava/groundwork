from typing import Any

from geoalchemy2.shape import to_shape
from shapely.geometry import MultiPolygon, Polygon, shape
from shapely.wkt import dumps


def geojson_to_wkt(geojson_dict: dict[str, Any]) -> str:
    """Convert GeoJSON Feature or Polygon/MultiPolygon geometry to WKT MultiPolygon."""
    if geojson_dict.get("type") == "FeatureCollection":
        features = geojson_dict.get("features", [])
        geoms = [shape(f["geometry"]) for f in features]
        multipolygon = MultiPolygon(
            [geom if isinstance(geom, Polygon) else geom.geoms[0] for geom in geoms]
        )
        return dumps(multipolygon)

    geom = shape(
        geojson_dict["geometry"]
        if geojson_dict.get("type") == "Feature"
        else geojson_dict
    )

    if isinstance(geom, Polygon):
        geom = MultiPolygon([geom])
    elif not isinstance(geom, MultiPolygon):
        raise ValueError("Geometry must be a Polygon or MultiPolygon")

    return dumps(geom)


def wkb_to_geojson(wkb_element) -> dict[str, Any]:
    """Convert GeoAlchemy WKBElement to GeoJSON dictionary."""
    if wkb_element is None:
        return None
    geom = to_shape(wkb_element)

    return {"type": "Feature", "geometry": geom.__geo_interface__, "properties": {}}
