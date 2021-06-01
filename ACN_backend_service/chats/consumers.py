# chat/consumers.py
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from chats.models import Message


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope['user']
        self.community = self.scope['community']
        if self.community and (self.user in self.community.participants.all() or self.community.creator==self.user):
            self.room_group_name = f'community_group_{self.community.id}'

            # Join room group
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )
            self.accept()

            #send previous message
            pre_msgs = [{
                'id': msg.id,
                'text': msg.text,
                'is_mine': msg.user==self.user,
                'username': msg.user.username,
                'avatar': msg.user.avatar.url if msg.user.avatar else '',
                'image': msg.image,
                'reply_to': msg.reply_to.id if msg.reply_to else '',
            } for msg in Message.objects.filter(community=self.community)]
            self.send(text_data=json.dumps({
            'pre_msgs': pre_msgs,
            'type': 'pre_msgs'
            }))
        else:
            self.close()
        
        

    def disconnect(self, close_code):
        # Leave room group
        try:
            async_to_sync(self.channel_layer.group_discard)(
                self.room_group_name,
                self.channel_name
            )
        except:
            pass

    # Receive message from WebSocket
    def receive(self, text_data):
        data = json.loads(text_data)
        
        # chat message
        if data.get('type') == 'chat_message':
            reply_to = None
            if data.get('reply_to'):
                try:
                    reply_to = Message.objects.get(id=data.get('reply_to'))
                except:
                    pass
            #save message in db
            msg = Message(
                text=data['text'],
                user=self.user,
                community=self.community, 
                reply_to=reply_to,
                image=data['image']
                )
            msg.save()
            message = {
                'id': msg.id,
                'text': msg.text,
                'username': msg.user.username,
                'avatar': msg.user.avatar.url if msg.user.avatar else '',
                'image': msg.image,
                'reply_to': msg.reply_to.id if msg.reply_to else '',
            }
            # Send message to room group
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'chat_message': message
                }
            )

        # delete chat message
        if data.get('type') == 'delete_message':
            try:
                msg = Message.objects.get(id=data.get('message_id'))
                message_id = msg.id
                msg.delete()
                #send deleted message id to room
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        'type': 'delete_message',
                        'message_id': message_id
                    }
                )
            except:
                pass

        #edit chat message
        if data.get('type') == 'edit_message':
            try:
                msg = Message.objects.get(id=data.get('message_id'))
                msg.text = data['new_text']
                msg.save()
                #send edited message to room
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    data
                )
            except:
                pass


    # Receive message from room group
    def chat_message(self, message):
        message['chat_message']['is_mine'] = message['chat_message']['username'] == self.user.username
        self.send(text_data=json.dumps(message))

    # receive deleted message from group
    def delete_message(self, message):
        self.send(text_data=json.dumps(message))

    # receive edited message
    def edit_message(self, message):
        self.send(text_data=json.dumps(message))


