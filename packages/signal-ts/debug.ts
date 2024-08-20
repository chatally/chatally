import { getLogger } from '@chatally/logger';
import { SignalApi } from 'src/SignalApi';

const log = getLogger({ level: "trace", name: "SgnlDv" });
const api = await new SignalApi({ log }).connected;

await api.send("PNI:+4917623975929", "Hello, I am ChatAlly.");
