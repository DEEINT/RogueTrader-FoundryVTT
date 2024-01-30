import { RogueTraderActor } from "./common/actor.js";
import { RogueTraderItem } from "./common/item.js";
import { ExplorerSheet } from "./sheet/actor/explorer.js";
import { NpcSheet } from "./sheet/actor/npc.js";
import { WeaponSheet } from "./sheet/weapon.js";
import { AmmunitionSheet } from "./sheet/ammunition.js";
import { WeaponModificationSheet } from "./sheet/weapon-modification.js";
import { ArmourSheet } from "./sheet/armour.js";
import { ForceFieldSheet } from "./sheet/force-field.js";
import { CyberneticSheet } from "./sheet/cybernetic.js";
import { DrugSheet } from "./sheet/drug.js";
import { GearSheet } from "./sheet/gear.js";
import { ToolSheet } from "./sheet/tool.js";
import { CriticalInjurySheet } from "./sheet/critical-injury.js";
import { MalignancySheet } from "./sheet/malignancy.js";
import { MentalDisorderSheet } from "./sheet/mental-disorder.js";
import { MutationSheet } from "./sheet/mutation.js";
import { PsychicPowerSheet } from "./sheet/psychic-power.js";
import { TalentSheet } from "./sheet/talent.js";
import { SpecialAbilitySheet } from "./sheet/special-ability.js";
import { TraitSheet } from "./sheet/trait.js";
import { AptitudeSheet } from "./sheet/aptitude.js";
import { initializeHandlebars } from "./common/handlebars.js";
import { migrateWorld } from "./common/migration.js";
import { prepareCommonRoll, prepareCombatRoll, preparePsychicPowerRoll } from "./common/dialog.js";
import { commonRoll, combatRoll } from "./common/roll.js";
import { chatListeners } from "./common/chat.js";
import RtMacroUtil from "./common/macro.js";
import Rt from "./common/config.js";

// Import Helpers
import * as chat from "./common/chat.js";

Hooks.once("init", () => {
    CONFIG.Combat.initiative = { formula: "@initiative.base + @initiative.bonus", decimals: 0 };
    CONFIG.Actor.documentClass = RogueTraderActor;
    CONFIG.Item.documentClass = RogueTraderItem;
    CONFIG.fontDefinitions["Caslon Antique"] = {editor: true, fonts: []};
    game.rogueTrader = {
        config: Rt,
        testInit: {
            prepareCommonRoll,
            prepareCombatRoll,
            preparePsychicPowerRoll
        },
        tests: {
            commonRoll,
            combatRoll
        }
    };
    game.macro = RtMacroUtil;
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("rogue-trader", ExplorerSheet, { types: ["explorer"], makeDefault: true });
    Actors.registerSheet("rogue-trader", NpcSheet, { types: ["npc"], makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("rogue-trader", WeaponSheet, { types: ["weapon"], makeDefault: true });
    Items.registerSheet("rogue-trader", AmmunitionSheet, { types: ["ammunition"], makeDefault: true });
    Items.registerSheet("rogue-trader", WeaponModificationSheet, { types: ["weaponModification"], makeDefault: true });
    Items.registerSheet("rogue-trader", ArmourSheet, { types: ["armour"], makeDefault: true });
    Items.registerSheet("rogue-trader", ForceFieldSheet, { types: ["forceField"], makeDefault: true });
    Items.registerSheet("rogue-trader", CyberneticSheet, { types: ["cybernetic"], makeDefault: true });
    Items.registerSheet("rogue-trader", DrugSheet, { types: ["drug"], makeDefault: true });
    Items.registerSheet("rogue-trader", GearSheet, { types: ["gear"], makeDefault: true });
    Items.registerSheet("rogue-trader", ToolSheet, { types: ["tool"], makeDefault: true });
    Items.registerSheet("rogue-trader", CriticalInjurySheet, { types: ["criticalInjury"], makeDefault: true });
    Items.registerSheet("rogue-trader", MalignancySheet, { types: ["malignancy"], makeDefault: true });
    Items.registerSheet("rogue-trader", MentalDisorderSheet, { types: ["mentalDisorder"], makeDefault: true });
    Items.registerSheet("rogue-trader", MutationSheet, { types: ["mutation"], makeDefault: true });
    Items.registerSheet("rogue-trader", PsychicPowerSheet, { types: ["psychicPower"], makeDefault: true });
    Items.registerSheet("rogue-trader", TalentSheet, { types: ["talent"], makeDefault: true });
    Items.registerSheet("rogue-trader", SpecialAbilitySheet, { types: ["specialAbility"], makeDefault: true });
    Items.registerSheet("rogue-trader", TraitSheet, { types: ["trait"], makeDefault: true });
    Items.registerSheet("rogue-trader", AptitudeSheet, { types: ["aptitude"], makeDefault: true });

    initializeHandlebars();

    game.settings.register("rogue-trader", "worldSchemaVersion", {
        name: "World Version",
        hint: "Used to automatically upgrade worlds data when the system is upgraded.",
        scope: "world",
        config: true,
        default: 0,
        type: Number
    });
    game.settings.register("rogue-trader", "autoCalcXPCosts", {
        name: "Calculate XP Costs",
        hint: "If enabled, calculate XP costs automatically.",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });
    game.settings.register("rogue-trader", "useSpraytemplate", {
        name: "Use Template with Spray Weapons",
        hint: "If enabled, Spray Weapons will require the user to put down a template before the roll is made. Templates are NOT removed automatically",
        scope: "client",
        config: true,
        default: true,
        type: Boolean
    });

});

Hooks.once("ready", () => {
    migrateWorld();
    CONFIG.ChatMessage.documentClass.prototype.getRollData = function() {
        return this.getFlag("rogue-trader", "rollData");
    };
});


/* -------------------------------------------- */
/*  Other Hooks                                 */
/* -------------------------------------------- */

/** Add Event Listeners for Buttons on chat boxes */
Hooks.once("renderChatLog", (chat, html) => {
    chatListeners(html);
});

/** Add Options to context Menu of chatmessages */
Hooks.on("getChatLogEntryContext", chat.addChatMessageContextOptions);
Hooks.on("getChatLogEntryContext", chat.showRolls);

/**
 * Create a macro when dropping an entity on the hotbar
 * Item      - open roll dialog for item
 */
Hooks.on("hotbarDrop", (bar, data, slot) => {
    if (data.type === "Item" || data.type === "Actor")
    {
        RtMacroUtil.createMacro(data, slot);
        return false;
    }
});

Hooks.on("renderRogueTraderSheet", (sheet, html, data) => {
    html.find("input.cost").prop("disabled", game.settings.get("rogue-trader", "autoCalcXPCosts"));
    html.find(":not(.psychic-power) > input.item-cost").prop("disabled", game.settings.get("rogue-trader", "autoCalcXPCosts"));
});
