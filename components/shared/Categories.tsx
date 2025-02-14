import CategoryCard from "../cards/CategoryCard";

const categories = ["Food", "Maintenance", "Cleaning", "Grocery", "Laundry", "Electronics", "Pharmacy", "More"];

const Categories = () => {
  return (
    <div className="px-4 mt-4">
      <h2 className="text-lg font-semibold">All Categories</h2>
      <div className="grid grid-cols-4 gap-3 mt-2">
        {categories.map((category, index) => (
          <CategoryCard key={index} category={category} image={`/category${index + 1}.png`} />
        ))}
      </div>
    </div>
  );
};

export default Categories;
