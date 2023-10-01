class varbits{
    /*
             headtrim
    ...|-------------||--------------|
    ...    bits[1]        bits[0]

    Elements in the bits array closer to 0 represent the least significant digits of the number, bits[0][0] being the absolute least significant
    headtrim is used to eliminate leading bits which would not otherwise be included in a bit array of a given size not divisible by 32 (you know, just in case)

    */
    constructor(size,fill=0){
        this.size = size;
        this.bits = [];
        for(let i=0;i<Math.ceil(size/32);i++){
            this.bits.push(fill);
        }
        let headtrim = 0;
        for(let i=0;i<(32-(size%32))%32;i++){
            headtrim = (headtrim<<1) | 1;
        }
        this.headtrim = headtrim;
    }

    getbits(bitsarr = this.bits, split=""){
        let holdstring = "";
        for(let i=bitsarr.length-1;i>=0;i--){
            holdstring += (bitsarr[i]>>>0).toString(2).padStart(32,"0");
            holdstring += split;
        }
        return holdstring.substring(holdstring.length-this.size);
    }

    setbits(bitStr){
        bitStr = bitStr.padStart(this.size,"0");
        for(let i=0;i<this.bits.length;i++){
            console.log(bitStr.substr(bitStr.length - (32*(i+1)),32));
            this.bits[i] = parseInt(bitStr.substr(bitStr.length - (32*(i+1)),32),2);
        }
    }

    and(bitStr){
        bitStr.padStart(this.size,"0")
        let holdstring = ""
        for(let i=this.bits.length-1;i>=0;i--){
            holdstring += ((this.bits[i]>>>0) & parseInt(bitStr.substr(bitStr.length-(32*(i+1))),2)).toString(2).padStart(32,"0");
        }
        return holdstring.substring(holdstring.length-this.size);
    }

    or(bitStr){
        bitStr.padStart(this.size,"0")
        let holdstring = ""
        for(let i=this.bits.length-1;i>=0;i--){
            holdstring += ((this.bits[i]>>>0) | parseInt(bitStr.substr(bitStr.length-(32*(i+1))),2)).toString(2).padStart(32,"0");
        }
        return holdstring.substring(holdstring.length-this.size);
    }

    xor(bitStr){
        bitStr.padStart(this.size,"0")
        let holdstring = ""
        for(let i=this.bits.length-1;i>=0;i--){
            holdstring += ((this.bits[i]>>>0) ^ parseInt(bitStr.substr(bitStr.length-(32*(i+1))),2)).toString(2).padStart(32,"0");
        }
        return holdstring.substring(holdstring.length-this.size);
    }

    not(){
        let holdstring = ""
        for(let i=this.bits.length-1;i>=0;i--){
            holdstring += (~this.bits[i]>>>0).toString(2).padStart(32,"0");
        }
        return holdstring.substring(holdstring.length-this.size);
    }

    leftshift(shift=0){
        shift = shift % this.size;
        let places = Math.ceil(shift/32); //Get bits from some number of 32-bit-wide places to the right

        let bits = [];
        for(let i=0;i<this.bits.length;i++){bits.push(this.bits[i])};
        for(let i=bits.length-1;i>=0;i--){
            if(i-places >= 0){
                //Pulling bits from elsewhere in the number
                bits[i] = (this.bits[i-(Math.ceil(shift/32) - 1)] << (shift%32)) | (this.bits[i- Math.ceil(shift/32)] >> (32-(shift%32)));
            }else if(i-places == -1){
                //This is the highest place to still get bits from the i-places-th frame, but it will be pulling zeros from the void
                bits[i] = (this.bits[i-(Math.ceil(shift/32) - 1)] << (shift%32));
            }else{
                //The shift has put zeros into the entire frame
                bits[i] = 0;
            }
        }
        return this.bits2str(bits)
    }

    //This is not sign preserving, but most PRNGs in real languages are set up with unsigned ints, so it shouldn't matter
    rightshift(shift=0){
        shift = shift % this.size;
        let places = Math.ceil(shift/32); //Get bits from some number of 32-bit-wide places to the left
        let bits = [];
        for(let i=0;i<this.bits.length;i++){bits.push(this.bits[i])};

        for(let i=0;i<this.bits.length;i++){
            if(i+places < this.bits.length){
                //Pulling bits from elsewhere in the number
                bits[i] = (this.bits[i+ (Math.ceil(shift/32) - 1)] >>> (shift%32)) | (this.bits[i- Math.ceil(shift/32)] << (32-(shift%32)));
                            //(this.bits[i-(Math.ceil(shift/32) - 1)] << (shift%32)) | (this.bits[i- Math.ceil(shift/32)] >> (32-(shift%32)));
            }else if(i+places == this.bits.length){
                //This is the highest place to still get bits from the i-places-th frame, but it will be pulling zeros from the void
                bits[i] = (this.bits[i+(Math.ceil(shift/32) - 1)] >>> (shift%32));
            }else{
                //The shift has put zeros into the entire frame
                bits[i] = 0;
            }
        }
        return this.bits2str(bits)
    }

    leftcycle(shift=0){
        shift = shift % this.size;
        let left = this.leftshift(shift).substring(0,this.size-shift);
        let right = this.rightshift(this.size - shift).substring(this.size-shift);

        return left+right;
    }

    rightcycle(shift=0){
        shift = shift % this.size;
        let left = this.leftshift(this.size - shift).substring(0,shift);
        let right = this.rightshift(shift).substring(shift,this.size);

        console.log(left);
        console.log(right);

        return left+right;
    }

}