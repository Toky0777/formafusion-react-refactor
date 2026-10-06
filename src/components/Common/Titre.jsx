import MiddleNav from "./MiddleNav";
import T from "../translate/AutoTranslator";

export default function Titre() {
  return (
    <div>
      <div className="relative flex justify-between ">
        <h1 className="text-2xl font-bold">
          {" "}
          <T>Analytics</T>{" "}
        </h1>

        <MiddleNav />

        <p></p>
      </div>
    </div>
  );
}
