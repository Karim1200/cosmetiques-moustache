/*
  COSMÉTIQUES MOUSTACHE — configuration facile
  1) Remplacez whatsappNumber par votre numéro au format international, sans +, espaces ni tirets.
     Exemple pour l'Algérie : 213XXXXXXXXX
  2) Remplacez facebookPage par le lien public de votre page Facebook.
  3) Modifiez la liste products pour ajouter vos vrais produits et prix.
*/
const STORE = {
  whatsappNumber: "213000000000",
  facebookPage: "https://www.facebook.com/",
  currency: "DA"
};

// Les produits de démonstration restent un secours si Supabase n’est pas configuré.
// Une fois configuré, la boutique charge les produits depuis la base Supabase.
let products = (window.STORE_PRODUCTS && Array.isArray(window.STORE_PRODUCTS)) ? window.STORE_PRODUCTS : [
  {id:1,name:"Parfum Élégance",category:"Parfums",description:"Une fragrance chaleureuse et raffinée.",price:4500,badge:"Coup de cœur",image:"assets/parfum-elegance.jpg"},
  {id:2,name:"Parfum Noir",category:"Parfums",description:"Un parfum intense au caractère affirmé.",price:5200,badge:"Populaire",image:"assets/parfum-noir.jpg"},
  {id:3,name:"Eau de parfum Floral",category:"Parfums",description:"Des notes florales douces et lumineuses.",price:3900,badge:"Nouveau",image:"assets/parfum-floral.jpg"},
  {id:4,name:"Rouge à lèvres",category:"Maquillage",description:"Une touche de couleur pour votre style.",price:1200,badge:"",image:"assets/rouge-a-levres.jpg"},
  {id:5,name:"Palette de maquillage",category:"Maquillage",description:"Des teintes faciles à associer.",price:2800,badge:"Sélection",image:"assets/palette.jpg"},
  {id:6,name:"Crème hydratante",category:"Soins",description:"Un essentiel pour votre routine beauté.",price:1800,badge:"",image:"assets/creme.jpg"},
  {id:7,name:"Sérum visage",category:"Soins",description:"Un soin à intégrer à votre rituel.",price:2400,badge:"Nouveau",image:"assets/serum.jpg"},
  {id:8,name:"Brume parfumée",category:"Parfums",description:"Une note légère pour tous les jours.",price:1600,badge:"",image:"assets/brume.jpg"}
];

let activeCategory = "Tous";
const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const emptyState = document.getElementById("emptyState");
const productCount = document.getElementById("productCount");
const activeFilter = document.getElementById("activeFilter");

function formatPrice(price) {
  return new Intl.NumberFormat("fr-DZ", {maximumFractionDigits:0}).format(price) + " " + STORE.currency;
}
function whatsappUrl(message) {
  const number = STORE.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
function createCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  const imageBox = document.createElement("div");
  imageBox.className = "product-image";
  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;
  img.loading = "lazy";
  img.onerror = () => {
    img.remove();
    const fallback = document.createElement("span");
    fallback.className = "fallback-art";
    fallback.textContent = product.category === "Parfums" ? "♢" : product.category === "Maquillage" ? "✧" : "❋";
    imageBox.appendChild(fallback);
  };
  imageBox.appendChild(img);
  if (product.badge) {
    const badge = document.createElement("span");
    badge.className = "product-badge";
    badge.textContent = product.badge;
    imageBox.appendChild(badge);
  }
  const info = document.createElement("div");
  info.className = "product-info";
  const category = document.createElement("div");
  category.className = "product-category";
  category.textContent = product.category;
  const name = document.createElement("h3");
  name.className = "product-name";
  name.textContent = product.name;
  const desc = document.createElement("p");
  desc.className = "product-description";
  desc.textContent = product.description;
  const bottom = document.createElement("div");
  bottom.className = "product-bottom";
  const price = document.createElement("span");
  price.className = "product-price";
  price.textContent = formatPrice(product.price);
  const link = document.createElement("a");
  link.className = "product-contact";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.href = whatsappUrl(`Bonjour, je souhaite avoir des informations sur : ${product.name} (${formatPrice(product.price)}).`);
  link.textContent = "Demander ↗";
  bottom.append(price, link);
  info.append(category, name, desc, bottom);
  card.append(imageBox, info);
  return card;
}
function renderProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase("fr");
  let visible = products.filter(p =>
    (activeCategory === "Tous" || p.category === activeCategory) &&
    [p.name,p.category,p.description].some(v => v.toLocaleLowerCase("fr").includes(query))
  );
  const sort = sortSelect.value;
  if (sort === "price-asc") visible.sort((a,b)=>a.price-b.price);
  if (sort === "price-desc") visible.sort((a,b)=>b.price-a.price);
  if (sort === "name") visible.sort((a,b)=>a.name.localeCompare(b.name,"fr"));
  grid.replaceChildren(...visible.map(createCard));
  emptyState.hidden = visible.length > 0;
  productCount.textContent = `${visible.length} produit${visible.length>1?"s":""}`;
  activeFilter.firstChild.textContent = activeCategory === "Tous" ? "Tous les produits" : activeCategory;
}
document.querySelectorAll(".category-tile").forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    document.querySelectorAll(".category-tile").forEach(b=>b.classList.toggle("active",b===button));
    renderProducts();
    if (window.innerWidth < 720) document.getElementById("produits").scrollIntoView({behavior:"smooth"});
  });
});
searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);
document.getElementById("resetFilters").addEventListener("click", () => {
  activeCategory = "Tous";
  searchInput.value = "";
  sortSelect.value = "featured";
  document.querySelectorAll(".category-tile").forEach(b=>b.classList.toggle("active",b.dataset.category==="Tous"));
  renderProducts();
});
document.getElementById("whatsappLink").href = whatsappUrl("Bonjour Cosmétiques Moustache, j'aimerais avoir des informations sur vos produits.");
document.getElementById("floatingWhatsapp").href = whatsappUrl("Bonjour Cosmétiques Moustache !");
document.getElementById("facebookLink").href = STORE.facebookPage;
document.getElementById("year").textContent = new Date().getFullYear();
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const opened = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(opened));
});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=> {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded","false");
}));
renderProducts();

// Charge les produits publiés depuis Supabase si la configuration est renseignée.
(async function loadOnlineProducts(){
  const cfg = window.SUPABASE_CONFIG || {};
  if (!window.supabase || !cfg.url || !cfg.anonKey || cfg.url.includes("YOUR-PROJECT-ID") || cfg.anonKey.includes("YOUR_SUPABASE")) return;
  try {
    const client = window.supabase.createClient(cfg.url, cfg.anonKey);
    const { data, error } = await client.from("products").select("id,name,category,description,price,badge,image").order("created_at", { ascending: false });
    if (error) throw error;
    products = (data || []).map(p => ({...p, image: p.image || ""}));
    renderProducts();
  } catch (err) { console.error("Impossible de charger les produits Supabase:", err); }
})();
