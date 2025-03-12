import {PixiManager} from "./core/PixiManager";
import {AppManager} from "./core/AppManager";
import {MagicWords} from "./pages/MagicWords";
import {MainMenu} from "./pages/MainMenu";

const pixiManager = new PixiManager();
const appManager = new AppManager(pixiManager);
void appManager.changePage(MainMenu)