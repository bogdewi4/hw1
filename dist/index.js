"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setting_1 = require("./setting");
const PORT = 3000;
setting_1.app.listen(PORT, () => {
    console.log(`App start on port: ${PORT}`);
});
