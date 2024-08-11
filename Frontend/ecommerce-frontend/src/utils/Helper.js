/**
 * This function get an array as products object, and return array of 
 *  orders that each order object contains array of his products and the total price of 
 *  all products in this order
 * @param orders array as products
 * @returns - array as orders
 */
export const processOrdersData = (orders) => {
    const result = orders.reduce((acc, item) => {
        // Find if the orderId already exists in the accumulator
        let order = acc.find(o => o.orderId === item.orderId);
    
        // If not, create a new order object
        if (!order) {
            order = {
                orderId: item.orderId,
                totalSum: 0,
                products: []
            };
            acc.push(order);
        }
    
        // Add the product to the products array of the found/created order
        order.products.push({
            orderItemId: item.orderItemId,
            productId: item.productId,
            name: item.name,
            description: item.description,
            price: item.price,
            stock: item.stock
        });
    
        // Add the price to the totalSum
        order.totalSum += item.price;
    
        return acc;
    }, []);
  return result;
};