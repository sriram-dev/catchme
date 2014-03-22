/*
 * draw a button on screen
 */
var Button = me.Rect.extend(
{
        /*
         * constructor
         */
        init: function(image, action, automode,  y)
        {
                // init stuff
                this.image = me.loader.getImage(image);
                this.action = action;
                this.automode = automode;
                this.pos = new me.Vector2d((me.video.getWidth() / 2 - this.image.width / 2), y);
                console.log("pos" + this.pos + "width : " + this.image.width + "height " + this.image.height);

                // call parent constructor
                this.parent(this.pos, this.image.width, this.image.height);

                // register mouse event
                me.input.registerPointerEvent("mousedown", this, this.clicked.bind(this));
        },

        /*
         * action to perform when a button is clicked
         */
        clicked: function()
        {
                game.data.automode = this.automode;
                if(game.data.automode) {
                    console.log("Autoplay clicked");
                } else {
                    console.log("Play clicked");
                }
                // start action
                me.state.change(this.action);
        },

        /*
         * drawing function
         */
        draw: function(context)
        {
                // on button hovered
                if (this.containsPointV(me.input.mouse.pos))
                    context.drawImage(this.image, this.pos.x, this.pos.y);
                else
                    context.drawImage(this.image, this.pos.x, this.pos.y);
        },

        /*
         * destroy event function
         */
        onDestroyEvent: function()
        {
                // release mouse events
                me.input.releasePointerEvent("mousedown", this);
        }
});

/* Main Player */
var PlayerEntity = me.ObjectEntity.extend({
	init:function(x,y) {                
		var settings = {};
        settings.image = me.loader.getImage("fly");
        settings.spritewidth = 85.33;
        settings.spriteheight = 60;
		this.parent(x,y,settings);
		// set the default horizontal & vertical speed (accel vector)
        this.setVelocity(6, 6);
        // to reduce the bounding box
        //this.updateColRect(8, 50, -1, 0);
        this.anchorPoint.set(0.0, 0.0);

        // init variables
        this.gravity = 0;
        this.alwaysUpdate = true;

        // enable collision
        this.collidable = true;
        var net = new brain.NeuralNetwork();
        if(game.data.automode == true) {
            //console.log(JSON.parse(game.data.nntoLoad));
            //net.fromJSON(game.data.nntoLoad);
            //var run = net.toFunction();
        }
	},
	
	update:function() {
		this.vel.x = 0;
        this.vel.y = 0;
        if(game.data.automode == false) {
		// move pos acc to key press 
    		if(me.input.isKeyPressed("up")) {
                this.collectData(this.pos.x, this.pos.y, 0, 1);
                this.vel.y -= this.accel.y * me.timer.tick;
    			if(this.pos.y < 0)
    				this.pos.y = 0;
                //console.log("pos.y" + this.pos.y);
    		}
    		if(me.input.isKeyPressed("down")) {
                this.collectData(this.pos.x, this.pos.y, 1, 1);
    			this.vel.y += this.accel.y * me.timer.tick;			
    			if(this.pos.y >   (me.video.getHeight() - this.renderable.height))
    				this.pos.y =  me.video.getHeight() - this.renderable.height;
    		}
    		
    		if(me.input.isKeyPressed("left")) {
                this.collectData(this.pos.x, this.pos.y, 2, 1);
                this.flipX(true);
    			this.vel.x -= this.accel.x * me.timer.tick;
    			if(this.pos.x < 0)
    				this.pos.x = 0;
    		}
    		
    		if(me.input.isKeyPressed("right")) {
                this.collectData(this.pos.x, this.pos.y, 3, 1);
                this.flipX(false);
    			this.vel.x += this.accel.x * me.timer.tick;
    			if(this.pos.x >   (me.video.getWidth() - this.renderable.width))
    				this.pos.x =  me.video.getWidth() - this.renderable.width;
    		}
        } else {
            var curData = this.collectData(this.pos.x, this.pos.y, 0, 2);
            console.log(curData);
            console.log(run(curData));
        }
		// temp code start
        
        //temp code end
		this.computeVelocity(this.vel);
        this.pos.add(this.vel);
        this.checkCollision();
		// return true if something is updated so that engine knows
		var updated = (this.vel.x != 0 || this.vel.y != 0);
        if(updated) {
            this.parent();
        }
        return updated;
	},
	
	checkCollision: function() {
        var res = me.game.collide(this);        
        if (res && res.obj.type == me.game.COLLECTABLE_OBJECT) {
            //console.log("collision detected");
            game.data.score += 10;
            me.game.remove(res);
        }
	},

    collectData: function(x,y, dir, type) {
        //get the coin positions in screen divided 5x5
        //console.log(me.video.getPos());
        var width = me.video.getPos().width;
        var height = me.video.getPos().height;
        var arr = [];        
        var validSet = [];
        var data = {};
        var outarr = [dir];

        //get all coin objects
        var collectibles = me.game.getEntityByProp("type", me.game.COLLECTABLE_OBJECT);
      
        //from all the objects, get the current set to iterate on 
        // since most collectibles would be no longer be on screen
        // and we dont care abt them
        for(var item = 0;item < collectibles.length; item++) {
            if(collectibles[item].pos.x > 0) {
                validSet.push(collectibles[item]);
            }
        }

        //console.log("Valid set length : " + validSet.length);
        
        for(var i=0;i<5;i++) {
            for(var j=0; j < 5;j++) {
                var fromx = i * width/5;
                var tox = (i+1) * width/5;
                var fromy = j * height/5;
                var toy = (j+1) * height/5;
                var foundCollectible = false;
                //console.log("Fromx : " + fromx + "tox: " + tox + " fromy: " + fromy + " toy: " + toy);
                //iterate all coin objects
                for(var item = 0;item < validSet.length; item++) {
                    if(validSet[item].pos.x >= fromx && validSet[item].pos.x <= tox && 
                        validSet[item].pos.y >= fromy && validSet[item].pos.y <= toy) {
                        foundCollectible = true;
                        break;
                    }
                }
                if(foundCollectible) {
                    arr.push(1);
                } else {
                    arr.push(0);
                }
                //chk for player pos
                if(x >= fromx && x <= tox && y >= fromy && y <= toy) {
                    arr[arr.length-1] = 2;
                }
            }
        }
        data.input = arr;
        if(type == 2)
            return data.input;        
        data.output = outarr;
        if(arr.length > 1)
            game.data.nndata.push(data);
        console.log("nndata size: " + game.data.nndata.length);
        //console.log(game.data.nndata);
    }
});



/*
 * background layer
 */
var BackgroundLayer = me.ImageLayer.extend(
{
        /*
         * constructor
         */
        init: function(image, speed)
        {
                name = image;
                width = me.video.getWidth();
                height = me.video.getHeight();
                z = 1;
                ratio = 1;
                this.speed = speed;
                // call parent constructor
                this.parent(name, width, height, image, z, ratio);
        },

        /*
         * update function
         */
        update: function()
        {
                // recalibrate image position
                if (this.pos.x >= this.imagewidth - 1)
                        this.pos.x = 0;

                // increment horizontal background position
                this.pos.x+= this.speed;				
                return true;
        }
});

/*
 * parallax background
 */
var BackgroundObject = Object.extend(
{
        /*
         * constructor
         */
        init: function()
        {
                me.game.add(new BackgroundLayer("sky", 1.0),1); // layer 1
				me.game.add(new BackgroundLayer("bkg1", 1.5),2); // layer 2
                me.game.sort();
        },

        /*
         * update function
         */
        update: function()
        {
            return true;
        }
});

var StripeEntity = me.ObjectEntity.extend({
	init:function(x,y) {
		var settings = {};
        //settings.image = me.loader.getImage("mid");
		settings.spritewidth = 121;
        settings.spriteheight = 110;
		this.parent(x,y,settings);      
		
		// set the default horizontal & vertical speed (accel vector)
        this.setVelocity(3, 3);
        this.anchorPoint.set(0.0, 0.0);

        // init variables
        this.gravity = 0;
        this.alwaysUpdate = true;
	},
	
	update:function() {
		
	}	
	
	
});


var CoinEntity  = me.ObjectEntity.extend({
    init: function(x,y) {
        var settings = {};
        settings.image = me.loader.getImage("coin");
        settings.spritewidth = 45;
        settings.spriteheight = 45;
        settings.type = me.game.COLLECTABLE_OBJECT;       
        this.parent(x,y,settings);

        // set velocity
        this.setVelocity(-7,0);
        this.anchorPoint.set(0.0, 0.0);

        this.gracity = 0;
        this.alwaysUpdate = true;
    },

    update: function() {
        // call parent constructor
        this.parent(this);

        // calculate velocity
        this.vel.x -= this.accel.x * me.timer.tick;

        // if the enemy object goes out from the screen,
        // remove it from the game manager
        
        if(this.pos.x < 0) {
            game.data.lives--;
            me.game.remove(this);
        }
        this.computeVelocity(this.vel);
                this.pos.add(this.vel);
        return true;
    }
});

var CoinUpdater = Object.extend({
    init: function() {
        this.fps = 0;
        this.alwaysUpdate = true;
    },

    update: function() {
        if ((this.fps++) % 30 == 0)
        {
            var width = me.video.getWidth();
            var height = me.video.getHeight();
            var newy = Math.random() * ((height - 10));
            var newx = Math.random() * ((width/2)) +  width/2;
            me.game.add(new CoinEntity(newx,newy),10);
        }
        me.game.sort();
    }
});

var DisplayScoreEntity = me.Renderable.extend({
    init: function(x, y) {         
        // call the parent constructor 
        // (size does not matter here)
        this.parent(new me.Vector2d(x, y), 10, 10); 
         
        // create a font
        this.font = new me.BitmapFont("32x32_font", 32);
        this.font.set("right");         
        
        // make sure we use screen coordinates
        this.floating = true;
    },
    
    draw : function (context) {
        //console.log("drawing score");
        this.font.draw (context, game.data.score, this.pos.x, this.pos.y);        
    }
});

var DisplayLifeEntity = me.Renderable.extend({
    init: function(x,y) {
        this.parent(new me.Vector2d(x, y), 10, 10);

        this.font = new me.BitmapFont("32x32_font", 32);
        this.font.set("right"); 

        this.floating = true;
    },

    draw: function(context) {
        this.font.draw(context, game.data.lives, this.pos.x, this.pos.y);
    }
});


