"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guestIdentity = void 0;
const GuestIdentityDriver_1 = require("./GuestIdentityDriver");
/** @group Plugins */
const guestIdentity = () => ({
    install(metaplex) {
        metaplex.identity().setDriver(new GuestIdentityDriver_1.GuestIdentityDriver());
    },
});
exports.guestIdentity = guestIdentity;
//# sourceMappingURL=plugin.js.map