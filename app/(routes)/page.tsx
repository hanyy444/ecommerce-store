import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import Billboard from "@/components/billboard";
import Container from "@/components/ui/container";
import ProductList from "@/components/product-list";

export const revalidate = 0;

export default async function Home() {
  const products = await getProducts({ isFeatured: true });
  const billboardId = "6570cbd5efa504070aac3b3a";
  const billboard = await getBillboard(billboardId);
  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard data={billboard} />
        <div className="flex- flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList
            title="Featured Products"
            items={products}
          />
        </div>
      </div>
    </Container>
  );
}
