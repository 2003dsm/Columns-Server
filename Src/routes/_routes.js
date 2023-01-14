const { Router } = require("express");
const router = Router();
/// Routes
router.use("/chat",require("./chatWithSockets/chat"));

router.get("/", (req, res) => {
res.json({"Title": "Hello World in Routes"}); //manda un JSON
});
module.exports = router;
