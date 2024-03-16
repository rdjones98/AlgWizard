	class Coefficient 
	{
		constructor(aDivName,aVal,aTextColor, aDragVal,aDragColor)
		{
			this.id      = "coef";
			this.divName = aDivName;
			this.val = aVal;
			this.textColor = aTextColor;
			this.dragValue = aDragVal;
			this.dragColor = aDragColor;
			
		}
		addToDiv(step)
		{
			this.id      = step + this.id;
			this.divName = step + this.divName;
			
			var coeffDiv = document.createElement("div");	
			coeffDiv.id			= this.id;
			coeffDiv.className	= "coefficient";
			if( this.dragValue != null )
				coeffDiv.draggable=true;
			coeffDiv.appendChild(document.createTextNode(this.val));

			if( this.dragValue != null )
			{
				var coeffDragDiv = document.createElement("div");	
				coeffDragDiv.id			= this.id + "drag";
				coeffDragDiv.className	= "coefficientDrag"
				coeffDragDiv.draggable	= true;
				coeffDragDiv.appendChild(document.createTextNode(this.dragValue));
				coeffDragDiv.style.color=this.dragColor
			}
			
			var obj = document.getElementById(this.divName);
			obj.appendChild(coeffDiv);
			if( coeffDragDiv != null )
				obj.appendChild(coeffDragDiv);
		}
		toString() {
			return this.val;
		}
	}
	class Variable
	{
		constructor(aDivName)
		{
			this.id      = "var";
			this.divName = aDivName;
		}
		addToDiv(step)
		{
			this.id 	 = step + this.id;
			this.divName = step + this.divName;
			
			var obj = document.getElementById(this.divName);
			obj.innerHTML+='<div id="v1" class="variable" draggable="false">x</div>';
		}
		toString() {
			return "x";
		}
	}
	class EqualSign
	{
		constructor()
		{
		}
		addToDiv()
		{
		}
		toString() {
			return "=";
		}
	}
	class Description
	{
		constructor(aVal)
		{
			this.FINISHED = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Finished!";
			this.SIMPLIFY = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Simplify!";
			this.COMBINE  = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Combine Like Terms!";


			this.id      = "desc";
			this.divName = "DESCRIPTION";
			if(aVal == "FINISHED")
				this.val = this.FINISHED;
			else if(aVal == "SIMPLIFY")
				this.val = this.SIMPLIFY;
			else if(aVal == "COMBINE")
				this.val = this.COMBINE;
			else
				this.val     = aVal;
		}
		addToDiv(step)
		{
			this.id      = step + this.id;
			this.divName = step + this.divName;

			var obj = document.getElementById(this.divName);
			obj.innerHTML += this.val;
		}
		toString() {
			return this.val;
		}

	}
	class Constant
	{
		constructor(aDivName,aVal,aTextColor, aBackColor, aDragVal,aDragColor)
		{
			this.id      = "const";
			this.divName = aDivName;
			this.val 	 = aVal;
			this.textColor = aTextColor;
			this.backColor = aBackColor;
			this.dragValue = aDragVal;
			this.dragColor = aDragColor;
			
		}
		addToDiv(step)
		{
			this.id      = step + this.id;
			this.divName = step + this.divName;

			var constDiv = document.createElement("div");	
			constDiv.id			= this.id;
			constDiv.className	= "constant";
			constDiv.style.color=this.textColor;
			
			if( this.backColor != null)
				constDiv.style.backgroundColor =this.backColor;
			
			if( this.dragValue != null)
				constDiv.draggable=true;
//			constDiv.appendChild(document.createTextNode(aVal));
			constDiv.innerHTML += this.val;

			if( this.dragValue != null )
			{
				var constDragDiv = document.createElement("div");	
				constDragDiv.id=this.id+"drag";
				constDragDiv.className="constantDrag"
				constDragDiv.draggable=true;
				constDragDiv.appendChild(document.createTextNode(this.dragValue));
				constDragDiv.style.color=this.dragColor;
			}
			
			var obj = document.getElementById(this.divName);
			obj.appendChild(constDiv);
			if(this.dragValue!=null)
				obj.appendChild(constDragDiv);
		}
		toString() {
			return this.val;
		}

	}
	
	class Wizard
	{
		constructor()
		{
			this.step = 0;
			this.steps = [];

			// Add DragStart Listener to the document
			document.addEventListener("dragstart", this.handleDragStart);
		}
		handleDragStart = (ev) => {
			ev.dataTransfer.setData("text", ev.target.id);
			ev.dataTransfer.dropEffect = "move";

			var obj = document.getElementById(ev.target.id+"drag");
	 		ev.dataTransfer.setDragImage(obj,40,10);
		}
		start()
		{
			this.addRow(0);
			var zero = this.steps[0];
			zero.forEach(item => {
				item.addToDiv(0);
			});
			this.step++;	
		}

		// Everytime there is a drop event show the results and then the next step
		handleDrop = (ev) => {
			this.addRow(this.step);
			var items = this.steps[this.step];
			items.forEach(item => {
				item.addToDiv(this.step);
			});

			this.step++;
			this.addRow(this.step);
			var items = this.steps[this.step];
			items.forEach(item => {
				item.addToDiv(this.step);
			});
			this.step++;
		}

		// Accepts multiple arguments
		addStep()
		{
			var args = [];
			for (var i=0; i<arguments.length; i++) 
				args.push(arguments[i]);
			this.steps.push(args);
		}
		// same as addStep, I just couldn't figure out how to pass the argument list into addStep and delegate
		addResult()
		{
			var args = [];
			for (var i=0; i<arguments.length; i++) 
				args.push(arguments[i]);
			this.steps.push(args);
		}

		addRow(aRow)
		{
			// Construct the left side,equals sign and right side
//			document.body.innerHTML += '<div class="description">Step 6: Undo any multiplication or division</div>';
			var lineDiv = document.createElement("div");
			lineDiv.className = "linediv";
			
			var descDiv = document.createElement("div");
			descDiv.id 			= aRow + "DESCRIPTION";
			descDiv.className 	= "description";
			//document.body.appendChild(descDiv);
			lineDiv.appendChild(descDiv);
			
			var lsDiv = document.createElement("div");	
			lsDiv.id		= aRow + "LEFTSIDE";
			lsDiv.className	= "leftSide";
			//document.body.appendChild(lsDiv);
			lsDiv.addEventListener("dragover",function(e) {e.preventDefault(); });
			lsDiv.addEventListener("drop",    this.handleDrop);
			lineDiv.appendChild(lsDiv);
			
			var equalsDiv = document.createElement("div");
			equalsDiv.className="equals";
			equalsDiv.appendChild(document.createTextNode("="));
			//document.body.appendChild(equalsDiv);
			lineDiv.appendChild(equalsDiv);
			
			var rsDiv = document.createElement("div");	
			rsDiv.id		= aRow + "RIGHTSIDE";
			rsDiv.className	= "rightSide";
			rsDiv.addEventListener("dragover",function(e) {e.preventDefault(); });
			rsDiv.addEventListener("drop",    this.handleDrop);
			//document.body.appendChild(rsDiv);
			lineDiv.appendChild(rsDiv);

			document.body.appendChild(lineDiv);
		}
	}
	// ---------------------
	// End Class definitions
	// ---------------------
