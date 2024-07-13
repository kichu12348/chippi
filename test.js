import intrepretor from "./dist/main.js";

const src =`
let a =5
let b=3
loop 5: say a
`

intrepretor(src)