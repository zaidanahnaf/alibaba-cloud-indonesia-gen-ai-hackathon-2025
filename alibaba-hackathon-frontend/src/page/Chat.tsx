// import React, { useState, useEffect, useRef } from 'react';
// import { getChatByCreator, postChat } from '../provider/chatProvider';

// const AIChat = () => {
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingHistory, setIsLoadingHistory] = useState(true);
//   const [creatorId] = useState('user-1'); // This would come from auth context
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);

//   // Auto scroll to bottom
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Load chat history on component mount
//   useEffect(() => {
//     loadChatHistory();
//   }, []);

//   const loadChatHistory = async () => {
//     try {
//       setIsLoadingHistory(true);
//       const history = await getChatByCreator(creatorId);
      
//       // Transform API data to chat format
//       const transformedMessages = [];
//       history.forEach(chat => {
//         transformedMessages.push({
//           id: `msg-${chat.id}`,
//           text: chat.message,
//           sender: 'user',
//           timestamp: chat.timestamp
//         });
//         transformedMessages.push({
//           id: `res-${chat.id}`,
//           text: chat.response,
//           sender: 'ai',
//           timestamp: chat.timestamp
//         });
//       });
      
//       setMessages(transformedMessages);
//     } catch (error) {
//       console.error('Error loading chat history:', error);
//     } finally {
//       setIsLoadingHistory(false);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim() || isLoading) return;

//     const userMessage = {
//       id: `user-${Date.now()}`,
//       text: inputMessage,
//       sender: 'user',
//       timestamp: new Date().toISOString()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputMessage('');
//     setIsLoading(true);

//     try {
//       // Call your API
//       const response = await postChat({
//         message: inputMessage,
//         creatorId: creatorId
//       });

//       const aiMessage = {
//         id: `ai-${Date.now()}`,
//         text: response.response,
//         sender: 'ai',
//         timestamp: response.timestamp
//       };

//       setMessages(prev => [...prev, aiMessage]);
//     } catch (error) {
//       console.error('Error sending message:', error);
//       const errorMessage = {
//         id: `error-${Date.now()}`,
//         text: 'Sorry, I encountered an error. Please try again.',
//         sender: 'ai',
//         timestamp: new Date().toISOString(),
//         isError: true
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const formatTime = (timestamp: any) => {
//     return new Date(timestamp).toLocaleTimeString('id-ID', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (isLoadingHistory) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Memuat riwayat chat...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       {/* Header */}
//       <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//             </svg>
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-gray-800">AI Assistant</h1>
//             <p className="text-sm text-gray-600">Online • Siap membantu Anda</p>
//           </div>
//         </div>
//       </div>

//       {/* Messages Container */}
//       <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
//         {messages.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-full text-center">
//             <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
//               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">Mulai Percakapan</h3>
//             <p className="text-gray-500 max-w-md">
//               Halo! Saya AI Assistant Anda. Silakan tanya apa saja dan saya akan membantu Anda dengan senang hati.
//             </p>
//           </div>
//         ) : (
//           messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//             >
//               <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
//                 {/* Avatar */}
//                 <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
//                   message.sender === 'user' 
//                     ? 'bg-gradient-to-r from-green-400 to-blue-500' 
//                     : 'bg-gradient-to-r from-purple-500 to-pink-500'
//                 }`}>
//                   {message.sender === 'user' ? (
//                     <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                   ) : (
//                     <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                   )}
//                 </div>

//                 {/* Message Bubble */}
//                 <div className={`relative px-4 py-3 rounded-2xl shadow-sm ${
//                   message.sender === 'user'
//                     ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
//                     : message.isError
//                     ? 'bg-red-100 border border-red-200 text-red-700'
//                     : 'bg-white border border-gray-200 text-gray-800'
//                 }`}>
//                   <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
//                   <p className={`text-xs mt-1 ${
//                     message.sender === 'user' 
//                       ? 'text-blue-100' 
//                       : message.isError 
//                       ? 'text-red-500' 
//                       : 'text-gray-500'
//                   }`}>
//                     {formatTime(message.timestamp)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}

//         {/* Loading indicator */}
//         {isLoading && (
//           <div className="flex justify-start">
//             <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
//               <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
//                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                 </svg>
//               </div>
//               <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
//                 <div className="flex space-x-1">
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 px-4 py-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="flex items-end space-x-3">
//             <div className="flex-1 relative">
//               <textarea
//                 ref={inputRef}
//                 value={inputMessage}
//                 onChange={(e) => setInputMessage(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Ketik pesan Anda di sini..."
//                 className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 rounded-2xl resize-none focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-300 min-h-[50px] max-h-32"
//                 rows={1}
//                 style={{ height: 'auto' }}
//                 onInput={(e) => {
//                   e.target.style.height = 'auto';
//                   e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
//                 }}
//                 disabled={isLoading}
//               />
              
//               {/* Character count or status */}
//               <div className="absolute right-3 bottom-3 text-xs text-gray-400">
//                 {inputMessage.length > 0 && (
//                   <span>{inputMessage.length}</span>
//                 )}
//               </div>
//             </div>

//             <button
//               onClick={handleSendMessage}
//               disabled={!inputMessage.trim() || isLoading}
//               className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
//             >
//               {isLoading ? (
//                 <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//               ) : (
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                 </svg>
//               )}
//             </button>
//           </div>
          
//           <p className="text-xs text-gray-500 mt-2 text-center">
//             Tekan Enter untuk mengirim • Shift+Enter untuk baris baru
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AIChat;