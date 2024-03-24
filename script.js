	class Draggable 
	{
		constructor(aDivName,aVal,aTextColor, aDragVal,aDragColor,aBackColor)
		{
			this.id      = "coef";
			this.divName = aDivName;
			this.val = aVal;
			this.textColor = aTextColor;
			this.dragValue = aDragVal;
			this.dragColor = aDragColor;
			this.backColor = aBackColor;
		}
		addToDiv(step)
		{
			this.id      = step + this.id;
			this.divName = step + this.divName;
			
			var coeffDiv = document.createElement("div");	
			coeffDiv.id			= this.id;
			coeffDiv.className	= "coefficient";
			coeffDiv.draggable=true;
			if(this.backColor!=null)
				coeffDiv.style.backgroundColor=this.backColor;
			coeffDiv.appendChild(document.createTextNode(this.val));

			var coeffDragDiv = document.createElement("div");	
			coeffDragDiv.id			= this.id + "drag";
			coeffDragDiv.className	= "coefficientDrag"
			coeffDragDiv.draggable	= true;
			coeffDragDiv.appendChild(document.createTextNode(this.dragValue));
			coeffDragDiv.style.color=this.dragColor
			
			var obj = document.getElementById(this.divName);
			obj.appendChild(coeffDiv);
			obj.appendChild(coeffDragDiv);
		}
		toString() {
			return this.val;
		}
	}
	class Prompt
	{
		constructor(x,y,aVal, aVal2)
		{
			this.x   = x;
			this.y   = y;
			this.val = aVal;
			this.val2 = aVal2;
			this.used = false;
		}
		addToDiv(step, aWizard)
		{
			this.theWizard = aWizard;

			let theButton = document.getElementById("theDialogButton");
			theButton.removeEventListener("click", this.okPressed);
			theButton.addEventListener("click",this.okPressed);

			let theDialog = document.getElementById("theDialog");
			theDialog.style.left = this.x + "px";
			theDialog.style.top  = this.y + "px";
		}
		okPressed = (ev) => {
			if( this.used == true )
				return;
			
			let theDialogTF = document.getElementById("theDialogTF");
			
			if( theDialogTF.value != this.val && theDialogTF.value != this.val2 )
			{
				alert("Simplify the expression in yellow");
				return;
			}
			theDialogTF.value="";
			
			let theDialog = document.getElementById("theDialog");
			theDialog.style.left = "0px";
			theDialog.style.top  = "-100px";
			
			this.theWizard.handleDrop();
			this.used = true;
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
	class Text
	{
		constructor(aDivName,aVal,aTextColor, aBackColor, aDragTarget)
		{
			this.id      = "const";
			this.divName = aDivName;
			this.val 	 = aVal;
			this.textColor = aTextColor;
			this.backColor = aBackColor;
			this.dragTarget = aDragTarget;
		}
		addToDiv(step, theWizard)
		{
			this.id      = step + this.id;
			this.divName = step + this.divName;

			var constDiv = document.createElement("div");	
			constDiv.id			= this.id;
			constDiv.className	= "constant";
			constDiv.style.color=this.textColor;
			
			if( this.dragTarget == true )
				constDiv.addEventListener("drop", theWizard.handleDrop);
			if( this.backColor != null)
				constDiv.style.backgroundColor =this.backColor;
			
			constDiv.innerHTML += this.val;


			var obj = document.getElementById(this.divName);
			obj.appendChild(constDiv);
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
				item.addToDiv(0, this);
			});
			this.step++;	
		}

		// Everytime there is a drop event show the results and then the next step
		handleDrop = (ev) => {
			this.addRow(this.step);
			var items = this.steps[this.step];
			items.forEach(item => {
				item.addToDiv(this.step, this);
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
			var lineDiv = document.createElement("div");
			lineDiv.className = "linediv";
			
			var descDiv = document.createElement("div");
			descDiv.id 			= aRow + "DESCRIPTION";
			descDiv.className 	= "description";
			lineDiv.appendChild(descDiv);
			
			var lsDiv = document.createElement("div");	
			lsDiv.id		= aRow + "LEFTSIDE";
			lsDiv.className	= "leftSide";
			lsDiv.addEventListener("dragover",function(e) {e.preventDefault(); });
			lineDiv.appendChild(lsDiv);
			
			var equalsDiv = document.createElement("div");
			equalsDiv.className="equals";
			equalsDiv.appendChild(document.createTextNode("="));
			lineDiv.appendChild(equalsDiv);
			
			var rsDiv = document.createElement("div");	
			rsDiv.id		= aRow + "RIGHTSIDE";
			rsDiv.className	= "rightSide";
			rsDiv.addEventListener("dragover",function(e) {e.preventDefault(); });
			lineDiv.appendChild(rsDiv);

			let pageDiv = document.getElementById("theWork");
			pageDiv.appendChild(lineDiv);
		}
	}
	// ---------------------
	// End Class definitions
	// ---------------------
