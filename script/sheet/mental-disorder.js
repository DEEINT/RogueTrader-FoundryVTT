import { RogueTraderItemSheet } from "./item.js";

export class MentalDisorderSheet extends RogueTraderItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["rogue-trader", "sheet", "mental-disorder"],
            template: "systems/rogue-trader/template/sheet/mental-disorder.hbs",
            width: 500,
            height: 369,
            resizable: false,
            tabs: [
                {
                    navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "stats"
                }
            ]
        });
    }

    _getHeaderButtons() {
        let buttons = super._getHeaderButtons();
        buttons = [].concat(buttons);
        return buttons;
    }

    activateListeners(html) {
        super.activateListeners(html);
    }
}
