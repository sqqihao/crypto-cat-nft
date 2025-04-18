import styles from "../../styles/cat.module.css";
import {foreheadStructData} from "./foreheadStructData.js"

export const CatForehead = function(props){
  const decorationColor = props.decorationColor;
  const foreheadShape = props.foreheadShape;
  const getColor = props.getColor;
  const forehead  = foreheadStructData(foreheadShape);
  return (
    <section className={forehead.forehead}>
      <div
        className={forehead.foreheadLeft}
        style={
          foreheadShape !== 5
            ? {
                backgroundColor: getColor(decorationColor),
              }
            : {
                backgroundColor: "black",
              }
        }
      />
      <div className={forehead.foreheadMid} style={{ backgroundColor: getColor(decorationColor) }} />
      <div
        className={forehead.foreheadRight}
        style={
          foreheadShape !== 5
            ? {
                backgroundColor: getColor(decorationColor),
              }
            : {
                backgroundColor: "white",
              }
        }
      />
    </section>
  );
};
