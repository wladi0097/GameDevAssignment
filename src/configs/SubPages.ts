import {AceOfShadows} from "../pages/AceOfShadows";
import {MagicWords} from "../pages/MagicWords";
import {PhoenixFlame} from "../pages/PhoenixFlame";
import {SubPageBase} from "../core/SubPageBase";
import {AppManager} from "../core/AppManager";

const allSubPages: ({ title: string; component: new (app: AppManager) => SubPageBase })[] = [
    {title: 'Ace of Shadows', component: AceOfShadows},
    {title: 'Magic Words', component: MagicWords},
    {title: 'Phoenix Flame', component: PhoenixFlame},
]

export default allSubPages