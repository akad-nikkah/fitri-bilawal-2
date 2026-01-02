import { Manuscript } from "./khoshnus.js";
import { FONT_MATRIX, initialize, write } from "./khoshnus.js";
import "./style.css";

const App = () => {
  useEffect(() => {
    const manuscript = new Manuscript();
    manuscript.setup({
      font: FONT_MATRIX["Pinyon Script"].name,
      fontSize: "10px",
    });
    const textId = manuscript.write(
      "Hello Universe, My Name Is Optimus Prime!",
    );
    manuscript.erase(textId, { delayOperation: 15000 });
  }, []);

  return (
    <div>
      <svg
        id="khoshnus"
        width="100%"
        height="500"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      ></svg>
    </div>
  );
};
