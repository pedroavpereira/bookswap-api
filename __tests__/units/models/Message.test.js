const Message = require('../../../models/Message')
const db = require('../../../db/connect')


describe('Message Model', () => {

    describe('createMessage', () => {
        it('should create a message entry in messages table', async () => {
            const mockMessageData = {
                message_id: 1,
                room_id: 1,
                user_sent: 101,
                message: 'Message for Test.',
                sent_at: '2024-08-30 11:45:40'
            };

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockMessageData] });

            const message = await Message.createMessage({ room_id: 1, user_sent: 101, message: 'Message for Test.' });

            expect(db.query).toHaveBeenCalledWith(
                "INSERT INTO message (room_id, author, message) VALUES ($1, $2, $3);", [1, 101, 'Message for Test.']
            );
            expect(message).toEqual(new Message(mockMessageData));
        });

        it('should throw an error if there is an issue adding new message entry to messages table', async () => {
            jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Unable to add message entry to messages table.'));

            await expect(Message.createMessage({ user_sent: 1})).rejects.toThrow('Unable to add message entry to messages table.');
        });
    });

    describe('getMessage', () => {
        it('should obtain all messages with a particular room_id', async () => {
            const mockMessageData = [
                {
                    message_id: 1,
                    room_id: 1,
                    user_sent: 101,
                    message: 'Message for Test.',
                    sent_at: '2024-08-30 11:45:40'
                },
                {
                    message_id: 2,
                    room_id: 1,
                    user_sent: 87,
                    message: 'Second Message for Test.',
                    sent_at: '2024-08-30 11:55:40'
                }, {
                    message_id: 3,
                    room_id: 2,
                    user_sent: 101,
                    message: 'Message for Test.',
                    sent_at: '2024-08-30 11:45:40'
                }
            ];

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockMessageData[0],mockMessageData[1]] });

            const messages = await Message.getMessages(1);

            expect(db.query).toHaveBeenCalledWith(
                "SELECT * FROM message WHERE room_id = $1;",[1]
            );
            expect(messages).toEqual([mockMessageData[0],mockMessageData[1]].map(row => new Message(row)));
        });

        it('should throw an error if there is an issue finding message entries with a particular room_id', async () => {
            const room_id = 1
            jest.spyOn(db, 'query').mockRejectedValueOnce(new Error(`Unable to find messages with room_id=${room_id}`));

            await expect(Message.getMessages(1)).rejects.toThrow(`Unable to find messages with room_id=${room_id}`);
        });
    });
});
