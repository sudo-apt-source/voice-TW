class VoicePro {

constructor(){

this.socket=null;
this.stream=null;
this.peers={};

this.player={
room:"global",
x:0,
y:0,
speaking:false
};

this.audioContext=null;
this.analyser=null;

}

getInfo(){
return{

id:"voicepro",
name:"Pro Voice",

blocks:[

{
opcode:"start",
blockType:Scratch.BlockType.COMMAND,
text:"start global voice room [ROOM]"
},

{
opcode:"setPos",
blockType:Scratch.BlockType.COMMAND,
text:"update voice position x [X] y [Y]"
},

{
opcode:"isTalking",
blockType:Scratch.BlockType.BOOLEAN,
text:"player talking?"
}

]

};
}

async start(args){

this.player.room=args.ROOM;

this.stream=await navigator.mediaDevices.getUserMedia({audio:true});

this.audioContext=new AudioContext();

const source=this.audioContext.createMediaStreamSource(this.stream);

this.analyser=this.audioContext.createAnalyser();

source.connect(this.analyser);

this.socket=io("https://YOUR_SERVER_IP");

this.socket.emit("join",this.player);

this.voiceDetection();

}

setPos(args){

this.player.x=args.X;
this.player.y=args.Y;

if(this.socket){
this.socket.emit("position",{x:args.X,y:args.Y});
}

}

isTalking(){

return this.player.speaking;

}

voiceDetection(){

const data=new Uint8Array(this.analyser.frequencyBinCount);

setInterval(()=>{

this.analyser.getByteFrequencyData(data);

let volume=data.reduce((a,b)=>a+b)/data.length;

const speaking=volume>30;

if(speaking!==this.player.speaking){

this.player.speaking=speaking;

if(this.socket){
this.socket.emit("speaking",speaking);
}

}

},100);

}

}

Scratch.extensions.register(new VoicePro());
