import { useState } from "react"
import "./App.css"

function App() {
  const [products, setProducts] = useState([])
const [showResults, setShowResults] = useState(false)
const [filters, setFilters] = useState({
  type: "",
  brand: "",
  supplier: "",
  min_price: "",
  max_price: "",
  min_calories: "",
  max_calories: "",
  min_protein: "",
  max_protein: "",
  max_sugar: "",
  oil_type: [],
  allergen_free: [],
  halal: null,
})

const fetchProducts = async () => {
  const params = new URLSearchParams()
  if (filters.type) params.append("type", filters.type)
  if (filters.min_price) params.append("min_price", filters.min_price)
  if (filters.max_price) params.append("max_price", filters.max_price)
  if (filters.min_calories) params.append("min_calories", filters.min_calories)
  if (filters.max_calories) params.append("max_calories", filters.max_calories)
  if (filters.brand) params.append("brand", filters.brand)
  if (filters.supplier) params.append("supplier", filters.supplier)
  if (filters.min_protein) params.append("min_protein", filters.min_protein)
  if (filters.max_protein) params.append("max_protein", filters.max_protein)
  if (filters.max_sugar) params.append("max_sugar", filters.max_sugar)
  if (filters.halal !== null) params.append("halal", filters.halal)
  filters.oil_type.forEach(o => params.append("oil_type", o))
  filters.allergen_free.forEach(a => params.append("allergen_free", a))
  

  const res = await fetch(`http://127.0.0.1:8000/snacks/filter?${params.toString()}`)
  const data = await res.json()
  setProducts(data)
}
const handleReset = () => {
  setFilters({
    type: "",
    brand: "",
    supplier: "",
    min_price: "",
    max_price: "",
    min_calories: "",
    max_calories: "",
    min_protein: "",
    max_protein: "",
    max_sugar: "",
    oil_type: [],
    halal: null,
    allergen_free: [],
    
  })
  setShowResults(false)
  setProducts([])
}

const handleApply = () => {
  fetchProducts()
  setShowResults(true)
}

  return (
  <div className="page">
    <header className="header">
      <h1>SELECTRA</h1>
      <p>Choose your preferred snacks options and browse the available products.</p>
    </header>

    <div className="filter-section">
      <div className="filter-grid">
        <div className="filter-card">
          <h3>Snacks Type</h3>
          {["Chocolate", "Biscuit", "Chips"].map((t) => (
            <label key={t} className="check-item">
              <input type="checkbox"
                checked={filters.type === t}
                onChange={() => setFilters({...filters, type: filters.type === t ? "" : t})}
              /> {t}
            </label>
          ))}
        </div>

        <div className="filter-card">
          <h3>Energy (kcal)</h3>
          <input type="number" placeholder="Min" value={filters.min_calories}
            onChange={(e) => setFilters({...filters, min_calories: e.target.value})} />
          <input type="number" placeholder="Max" value={filters.max_calories}
            onChange={(e) => setFilters({...filters, max_calories: e.target.value})} />
        </div>

        <div className="filter-card">
          <h3>Protein (g)</h3>
          <input type="number" placeholder="Min protein" value={filters.min_protein}
            onChange={(e) => setFilters({...filters, min_protein: e.target.value})} />
          <input type="number" placeholder="Max protein" value={filters.max_protein}
            onChange={(e) => setFilters({...filters, max_protein: e.target.value})} />
        </div>

        <div className="filter-card">
          <h3>Sugar (g)</h3>
          <input type="number" placeholder="Max sugar" value={filters.max_sugar}
            onChange={(e) => setFilters({...filters, max_sugar: e.target.value})} />
        </div>

        <div className="filter-card">
  <h3>Oil Type</h3>
  {["Sunflower Oil", "Palm Oil", "Corn Oil", "Canola Oil", "Cocoa Oil", "Cotton Oil"].map((o) => (
    <label key={o} className="check-item">
      <input type="checkbox"
        checked={filters.oil_type.includes(o)}
        onChange={() => {
          const current = filters.oil_type
          const updated = current.includes(o)
            ? current.filter(v => v !== o)
            : [...current, o]
          setFilters({...filters, oil_type: updated})
        }}
      /> {o}
    </label>
  ))}
</div>

        <div className="filter-card">
          <h3>Suppliers</h3>
          {["Migros", "A101", "BIM", "SOK"].map((s) => (
            <label key={s} className="check-item">
              <input type="checkbox"
                checked={filters.supplier === s}
                onChange={() => setFilters({...filters, supplier: filters.supplier === s ? "" : s})}
              /> {s}
            </label>
          ))}
        </div>

        <div className="filter-card">
          <h3>Brands</h3>
          {["Ülker", "Eti", "Lays"].map((b) => (
            <label key={b} className="check-item">
              <input type="checkbox"
                checked={filters.brand === b}
                onChange={() => setFilters({...filters, brand: filters.brand === b ? "" : b})}
              /> {b}
            </label>
          ))}
        </div>

        <div className="filter-card">
          <h3>Price (₺)</h3>
          <input type="number" placeholder="Min" value={filters.min_price}
            onChange={(e) => setFilters({...filters, min_price: e.target.value})} />
          <input type="number" placeholder="Max" value={filters.max_price}
            onChange={(e) => setFilters({...filters, max_price: e.target.value})} />
        </div>
        
        <div className="filter-card">
  <h3>Allergens</h3>
  {["Gluten", "Milk product", "Egg", "Peanut", "Soy product", "Sesame", "Nut"].map((a) => (
    <label key={a} className="check-item">
      <input type="checkbox"
        checked={filters.allergen_free.includes(a)}
        onChange={() => {
          const current = filters.allergen_free
          const updated = current.includes(a)
            ? current.filter(v => v !== a)
            : [...current, a]
          setFilters({...filters, allergen_free: updated})
        }}
      /> {a}-Free
    </label>
  ))}
</div>

<div className="filter-card">
  <h3>Halal</h3>
  <label className="check-item">
    <input type="radio" name="halal"
      checked={filters.halal === null}
      onChange={() => setFilters({...filters, halal: null})}
    /> All
  </label>
  <label className="check-item">
    <input type="radio" name="halal"
      checked={filters.halal === true}
      onChange={() => setFilters({...filters, halal: true})}
    /> Halal
  </label>
  <label className="check-item">
    <input type="radio" name="halal"
      checked={filters.halal === false}
      onChange={() => setFilters({...filters, halal: false})}
    /> Non-Halal
  </label>
</div>

        
        <div className="filter-actions">
          <button className="btn-apply" onClick={handleApply}>Apply Filtering</button>
          <button className="btn-reset" onClick={handleReset}>Reset</button>
        </div>
      </div>
    </div>

    {showResults && (
      <div className="product-grid">
        {products.length === 0 && <p className="info-text">Ürün bulunamadı.</p>}
        {products.map((p, i) => (
          <div key={i} className="product-card">
            <div className="product-name">{p.name}</div>
            <div className="product-brand">{p.brand}</div>
            <div className="product-details">
              <span>{p.energy_kcal} kcal</span>
              <span>Protein: {p.protein_g}g</span>
              <span>Sugar: {p.sugar_g}g</span>
            </div>
            <div className="product-footer">
              <span className="product-price">₺{p.price}</span>
              <span className="product-branch">{p.branch}</span>
            </div>
          </div>
        ))}
      </div>
    )}

  </div>
)
}

export default App