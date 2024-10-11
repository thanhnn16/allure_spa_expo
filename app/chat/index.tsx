// import React, { useState } from 'react';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { Channel as ChannelType, StreamChat } from 'stream-chat';
// import { Channel, ChannelList, Chat, MessageInput, MessageList, MessageType, OverlayProvider, Thread } from 'stream-chat-expo';

// const client = StreamChat.getInstance('3n8dprq8z4p5');

// await client.connectUser(
//   {
//     id: 'jlahey',
//     name: 'Jim Lahey',
//     image: 'https://i.imgur.com/fR9Jz14.png',
//   },
//   'user_token',
// );

// const channel = client.channel('messaging', 'the_park', {
//   name: 'The Park',
// });

// await channel.create();

// const index = () => {

//   const [channel, setChannel] = useState<ChannelType>();
//   const [thread, setThread] = useState<MessageType | null>();

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <OverlayProvider>
//         <Chat client={client}>
//           {channel ? (
//             <Channel channel={channel} keyboardVerticalOffset={0}  threadList={!!thread}>
//               {thread ? (
//                 <Thread />
//               ) : (
//                 <>
//                   <MessageList onThreadSelect={setThread} />
//                   <MessageInput />
//                 </>
//               )}
//             </Channel>
//           ) : (
//             <ChannelList onSelect={setChannel} />
//           )}
//         </Chat>
//       </OverlayProvider>
//     </GestureHandlerRootView>
//   )
// }

// export default index