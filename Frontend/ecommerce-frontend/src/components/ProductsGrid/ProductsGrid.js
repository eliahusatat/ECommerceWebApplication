//component
import ProductCard from '../ProductCard/ProductCard';
//style
import './ProductsGrid.css';


const ProductsGrid = ({ products,  buttonText, onButtonClick, extraButtons, secondBtn = false , secondBtnTxt = "",onSecondBtnClick = ()=>{} }) => {
  return (
    <div className="products-page">
      {extraButtons && <div >{extraButtons}</div>}
      <div className="products-grid">
        {products && products.map(product => (
          <ProductCard 
            key={product.productId} 
            product={product} 
            buttonText={buttonText} 
            onButtonClick={onButtonClick} 
            secondBtn={secondBtn}
            secondBtnTxt={secondBtnTxt}
            onSecondBtnClick={onSecondBtnClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsGrid;
