import { useDispatch, useSelector } from "react-redux";
import { bagActions } from "../store/bagSlice";
import { IoIosAddCircleOutline } from "react-icons/io";
import { PiCoatHangerFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";

const HomeItem = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleAddToBag = () => {
    dispatch(bagActions.addToBag(item.id));
  };
  const handleRemoveFromBag = () => {
    dispatch(bagActions.removeFromBag(item.id));
  };
  const handleTryOn = () => {
    navigate("/try-on", { state: { garment: item } }); // Pass garment data via state
  };

  const bagItems = useSelector((store) => store.bag);
  const elementFound = bagItems.indexOf(item.id) >= 0;
  console.log(elementFound);
  return (
    <div className="item-container">
      <img className="item-image" src={item.link} alt="item image" />
      <div className="rating">
        {item.rating.stars} ⭐ | {item.rating.count}
      </div>
      <div className="company-name">{item.company}</div>
      <div className="item-name">{item.item_name}</div>
      <div className="price">
        <span className="current-price">Rs {item.current_price}</span>
        <span className="original-price">Rs {item.original_price}</span>
        <span className="discount">({item.discount_percentage}% OFF)</span>
      </div>
      {elementFound ? (
        <button
          type="button"
          className=" btn  btn-danger  delete"
          onClick={handleRemoveFromBag}
        >
          <MdDeleteForever /> Remove
        </button>
      ) : (
        <button
          type="button"
          className=" btn btn-add-bag"
          onClick={handleAddToBag}
        >
          <IoIosAddCircleOutline /> Add to Bag
        </button>
      )}
      <button type="button" className=" btn btn-add-bag" onClick={handleTryOn}>
        <PiCoatHangerFill /> Try-on
      </button>
    </div>
  );
};

export default HomeItem;
