// bundle/src/plugins/endchord/index.ts
// EndChord + CompactLayout merged into ONE plugin. UNTESTED.
// The docs say the build stops if a folder defines more than one plugin,
// so both features share a single definePlugin and one settings page.
//
// Guessed, so verify against an existing plugin:
//  - import paths ("../api", "../hooks") and the t / tx import
//  - the row fields used in onMessageRow (spacing, hideAvatar, hideTime)
import { definePlugin } from "../api";
import { addMessageAction, command, onMessageRow, onSend } from "../hooks";
// copy the t / tx import from any existing plugin

const PROGRESSIONS = ["I – V – vi – IV", "ii – V – I", "I – IV – V – I", "vi – IV – I – V"];
const pick = () => PROGRESSIONS[Math.floor(Math.random() * PROGRESSIONS.length)];

export default definePlugin({
    id: "endcord.endchord",
    name: "EndChord",
    description: tx("Chord progression command plus a compact chat layout"),
    settings: {
        // EndChord
        signoffEnabled: { type: "boolean", label: tx("Add sign-off to my messages"), default: false },
        signoff: { type: "text", label: tx("Sign-off text"), default: "🎵" },
        // CompactLayout
        compact: { type: "boolean", label: tx("Compact messages"), default: true },
        hideAvatars: { type: "boolean", label: tx("Hide avatars"), default: false },
        hideTimes: { type: "boolean", label: tx("Hide timestamps"), default: false },
    },
    start({ store, cleanup }) {
        cleanup(
            // --- EndChord ---
            onSend("endchord", content => (store.signoffEnabled ? `${content} ${store.signoff}` : undefined)),
            addMessageAction({
                key: "endchord",
                icon: "CopyIcon",
                label: () => t("Chord progression"),
                onPress: () => pick(),
            }),
            command({
                name: "endchord",
                description: tx("Send a random chord progression"),
                run: () => pick(),
            }),

            // --- CompactLayout ---
            onMessageRow("endchord-layout", row => {
                if (store.compact) row.spacing = 0;
                if (store.hideAvatars) row.hideAvatar = true;
                if (store.hideTimes) row.hideTime = true;
                return row;
            }),
        );
    },
});
