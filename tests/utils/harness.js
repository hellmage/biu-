export function props(obj) {
  for (var prop in obj)
    console.log(`obj.${prop} = ${obj[prop]}`);
}
