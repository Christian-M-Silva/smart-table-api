import { parseISO, format } from 'date-fns';
const { google } = require('googleapis');
import Env from '@ioc:Adonis/Core/Env'
import CryptoJS from 'crypto-js';
export default class GoogleCalendarApi {
    public async authorizeApi(token: string) {
        try {
            if (!token) {
                throw new Error('401')
            }
            const bytes = CryptoJS.AES.decrypt(token, Env.get('SECRET_KEY'));
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            let credentials = decryptedData.credentials
            credentials.client_id = Env.get('CLIENT_ID')
            credentials.client_secret = Env.get('CLIENT_SECRET')
            // credentials = {
            //     "refresh_token": "1//0h-RZzUz8pi-fCgYIARAAGBESNwF-L9IrqgVGTkTG5yFXCDzfL296NQo7XKXHKD7xIN4_W2s4nh3Q5imvDTTtww__5hGJnMQ6GsQ",
            //     type: 'authorized_user',
            //     "client_id":
            //         '480592212237-c2m76cn3vs1rro9dhgph56lmv0vkac22.apps.googleusercontent.com',
            //     "client_secret":
            //         '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'
            // }
            return google.auth.fromJSON(credentials);
        } catch (err) {
            return null;
        }
    }

    public createEvent(dataTable: { [key: string]: string }, token: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const date = format(parseISO(dataTable.nextUpdate), 'yyyy-MM-dd');
                const auth = await this.authorizeApi(token);
                const event = {
                    summary: `Atualizar a tabela ${dataTable.nameTable}`,
                    description: `Abra o sistema e ele atualizará sua(s) tabela(s) automaticamente`,
                    start: {
                        date,
                    },
                    end: {
                        date,
                    },
                };
                const calendar = await google.calendar({ version: 'v3', auth });
                const dataEvent = {
                    auth,
                    calendarId: 'primary',
                    resource: event,
                };
                await calendar.events.insert(dataEvent, (err: any, event: any) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(event.data.id);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    public updateEvent(dataTable: { [key: string]: string }, email: string, eventId: string, nameTable: string, token: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const eventStatus = await this.getEvent(eventId, token)
                if (eventStatus.data.status === 'cancelled') {
                    const newEventId = await this.createEvent(dataTable, token)
                    return resolve(newEventId)
                }
                const date = format(parseISO(dataTable.nextUpdate), 'yyyy-MM-dd');
                const auth = await this.authorizeApi(token);
                const event = {
                    summary: `Atualizar a tabela ${nameTable}`,
                    description: `Abra o sistema e ele atualizará sua(s) tabela(s) automaticamente`,
                    start: {
                        date,
                    },
                    end: {
                        date,
                    },
                };
                const calendar = await google.calendar({ version: 'v3', auth });
                const dataEvent = {
                    auth,
                    calendarId: email,
                    eventId,
                    resource: event,
                };
                await calendar.events.update(dataEvent)
                resolve('')
            } catch (error) {
                reject(error);
            }
        });
    }

    public async deleteEvent(eventId: string, token: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const event = await this.getEvent(eventId, token)
                if (event.data.status === 'cancelled') {
                    resolve()
                }
                const auth = await this.authorizeApi(token);
                const calendar = await google.calendar({ version: 'v3', auth });
                await calendar.events.delete({
                    calendarId: 'primary',
                    eventId,
                })
                resolve()
            } catch (error) {
                reject(error)
            }
        });
    }

    public async getEvent(eventId: string, token: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const auth = await this.authorizeApi(token);
                const calendar = await google.calendar({ version: 'v3', auth });
                const event = await calendar.events.get({
                    calendarId: 'primary',
                    eventId,
                })
                resolve(event)
            } catch (error) {
                reject(error)
            }
        });
    }
}