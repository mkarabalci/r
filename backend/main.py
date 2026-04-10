from fastapi.responses import JSONResponse
import json

from fastapi import FastAPI
from backend.database import get_connection

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Selectra backend calisiyor!"}

@app.get("/test-db")
def test_db():
    conn = get_connection()
    conn.close()
    return {"message": "Veritabani baglantisi basarili!"}

#Veritabanına bağlan
#Tüm atıştırmalıkları şube, fiyat ve besin detaylarıyla birlikte getir
#JSON olarak döndür
@app.get("/snacks")
def get_snacks():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
                   p.id,
                   p.name,
                   b.name AS brand,
                   bp.price,
                   bp.stock_quantity,
                   br.name AS branch,
                   sd.snacks_type,
                   sd.energy_kcal,
                   sd.protein_g,
                   sd.sugar_g,
                   sd.allergens
        FROM products p
        JOIN brands b ON p.brand_id = b.id
        JOIN branch_products bp ON p.id = bp.product_id
        JOIN branches br ON bp.branch_id = br.id
        JOIN snack_details sd ON p.id = sd.product_id
        WHERE bp.stock_quantity > 0
        ORDER BY p.name
 """)
    
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    snacks = []
    for row in rows:
        snacks.append({
            "id": row[0],
            "name": row[1],
            "brand": row[2],
            "price": float(row[3]),
            "stock": row[4],
            "branch": row[5],
            "type": row[6],
            "energy_kcal": row[7],
            "protein_g": float(row[8]),
            "sugar_g": float(row[9]),
            "allergens": row[10]
        })

    return JSONResponse(content=snacks, media_type="application/json; charset=utf-8")

# kullanıcı snacks type, kalori, allerjen, fiyat gibi filtreleri seçince sadece uygun ürünler gelecek.
from typing import Optional, List

@app.get("/snacks/filter")
def filter_snacks(
    type: Optional[str] = None,
    min_calories: Optional[int] = None,
    max_calories: Optional[int] = None,
    max_sugar: Optional[float] = None,
    min_protein: Optional[float] = None,
    oil_type: Optional[str] = None,
    packaging: Optional[str] = None,
    allergen_free: Optional[str] = None,
    halal: Optional[bool] = None,
    brand: Optional[str] = None,
    supplier: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        SELECT 
            p.id, p.name, b.name AS brand, bp.price, bp.stock_quantity,
            br.name AS branch, s.company_name AS supplier,
            sd.snacks_type, sd.energy_kcal, sd.protein_g, sd.sugar_g,
            sd.oil_type, sd.packaging, sd.allergens
        FROM products p
        JOIN brands b ON p.brand_id = b.id
        JOIN branch_products bp ON p.id = bp.product_id
        JOIN branches br ON bp.branch_id = br.id
        JOIN suppliers s ON br.supplier_id = s.id
        JOIN snack_details sd ON p.id = sd.product_id
        WHERE bp.stock_quantity > 0
    """

    params = []

    if type:
        query += " AND sd.snacks_type = %s"
        params.append(type)

    if min_calories:
        query += " AND sd.energy_kcal >= %s"
        params.append(min_calories)

    if max_calories:
        query += " AND sd.energy_kcal <= %s"
        params.append(max_calories)

    if max_sugar:
        query += " AND sd.sugar_g <= %s"
        params.append(max_sugar)

    if min_protein:
        query += " AND sd.protein_g >= %s"
        params.append(min_protein)

    if oil_type:
        query += " AND %s = ANY(sd.oil_type)"
        params.append(oil_type)

    if packaging:
        query += " AND sd.packaging = %s"
        params.append(packaging)

    if allergen_free:
        query += " AND NOT (%s = ANY(sd.allergens))"
        params.append(allergen_free)

    if halal:
        query += " AND 'Halal' = ANY(sd.allergens)"

    if brand:
        query += " AND b.name = %s"
        params.append(brand)

    if supplier:
        query += " AND s.company_name = %s"
        params.append(supplier)

    if min_price:
        query += " AND bp.price >= %s"
        params.append(min_price)

    if max_price:
        query += " AND bp.price <= %s"
        params.append(max_price)

    query += " ORDER BY p.name"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    snacks = []
    for row in rows:
        snacks.append({
            "id": row[0],
            "name": row[1],
            "brand": row[2],
            "price": float(row[3]),
            "stock": row[4],
            "branch": row[5],
            "supplier": row[6],
            "type": row[7],
            "energy_kcal": row[8],
            "protein_g": float(row[9]),
            "sugar_g": float(row[10]),
            "oil_type": row[11],
            "packaging": row[12],
            "allergens": row[13]
        })

    return JSONResponse(content=snacks, media_type="application/json; charset=utf-8")