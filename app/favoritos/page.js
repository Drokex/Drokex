import { getProducts } from "@/lib/products";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import FavoritosGrid from "@/app/components/favoritos-grid";
import styles from "@/app/categorias/page.module.css";

export default async function FavoritosPage() {
  const products = await getProducts();

  return (
    <main className={styles.cdkPage}>
      <SiteHeader />
      <div className="shell" style={{ padding: "40px 0 80px" }}>
        <h1 style={{ marginBottom: 24 }}>Mis favoritos</h1>
        <FavoritosGrid products={products} />
      </div>
      <SiteFooter />
    </main>
  );
}
