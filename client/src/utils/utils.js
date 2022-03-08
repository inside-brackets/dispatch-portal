export const incrementCounter = ()=>{
    let counters = JSON.parse(localStorage.getItem("counters"));
    if (counters) {
      localStorage.setItem(
        "counters",
        JSON.stringify({ ...counters, counter: parseInt(counters.counter) + 1 })
      );
    }
}