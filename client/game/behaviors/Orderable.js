import OrderData from "../OrderData";

function Orderable(entity) {
  entity.orders = [];
  entity.addOrder = (order) => {
    entity.orders.push(order);
  };

  entity.on('UPDATE', onUpdate);

  function onUpdate() {
    const order = entity.orders[0];
    if (!!entity.orders[0]) {
      OrderData[order.type](entity.game, entity, order.data)
    }
  }
}

export default Orderable;