import { createBot, createFlow, MemoryDB, addKeyword, createProvider } from '@bot-whatsapp/bot';
import { BaileysProvider, handleCtx } from '@bot-whatsapp/provider-baileys';

const flowBienvenida = addKeyword('hola');

const main = async () => {
    // Crea una instancia del proveedor en lugar de usar createProvider
    const provider = createProvider(BaileysProvider);

    // Inicializa el servidor HTTP si lo necesitas
    await provider.initHttpServer(3002); 

    // Aquí puedes agregar más lógica de servidor HTTP si lo necesitas
    provider.http.server.post('/send-message', handleCtx(async(bot,req, res) => {
        
        
        const body = req.body
        const header = req.headers
        const auth = header.authorization
        const number = body.phoneNumber
        const message = body.message
        
        const authorzationHeader = 'IJyKJI8qunYei6Z2fUqwMMMZ5f2Q9wamnEOOv2nb9vouc18u1bGvkZRiBANjGYi73WzRyymkhzXL9velolILlwiWogpRnSpgeX3U'
        
        if (!auth) {
            res.end(JSON.stringify({ status:402, message: 'No se ha enviado token' }));
            return;
        } else if (auth!=authorzationHeader) {
            res.end(JSON.stringify({status:403, message: 'Token enviado no tiene autorizacion'}));
            return;
        } else {
            await bot.sendMessage(number, message, []);
            res.end(JSON.stringify({status:200, message: 'El mensaje se ha enviado con éxito'}));
        }

     }));

    // Inicializa el bot
    await createBot({
        flow: createFlow([flowBienvenida]),
        database: new MemoryDB(),
        provider
    });
};

// No olvides llamar a la función main para ejecutar el código
main().catch(console.error);
