import { Client } from 'src/client/Client';

// const dbKey = Client.generateDbKey();
// console.log({ dbKey })
const dbKey = "59dd4542be9d724fc84708cfd75f5eded5295858ef96422e37eed00620c6b3b2";
const client = await new Client({ dbKey, log: "Signal" }).ready;

// const id = await client.messaging.sendMessage({
//   serviceId: "11111111-1111-4111-1111-111111111111",
//   messageText: "Hello, from ChatAlly!"
// });
// console.log("Just sent my first message:", id);
