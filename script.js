let grid=document.querySelector(".grid");
let filters=document.querySelectorAll(".filter div");
let addBtn=document.querySelector(".add");
let body=document.querySelector("body");
let uid=new ShortUniqueId();

let modalVisible= false;


let colors={
    pink:"#d595aa",
    blue:"#5ecdde",
    green:"#91e6c7",
    black:"black"
}

if(!(localStorage.getItem("tasks"))){
    localStorage.setItem("tasks", JSON.stringify([]))
}
let colorClasses=["pink","blue","green","black"];

let deleteState=false;
let deleteBtn = document.querySelector(".delete");

deleteBtn.addEventListener("click",function(e){
    if(deleteState){
        deleteState=false;
        e.currentTarget.classList.remove("delete-state");
    }
    else{
        deleteState=true
        e.currentTarget.classList.add("delete-state");
    }
})


addBtn.addEventListener("click",function(e){
    if(modalVisible){return;}
    if(deleteBtn.classList.contains("delete-state")){
        deleteBtn.classList.remove("delete-state");
        deleteState=false;
    }
let modal= document.createElement('div');
    modal.classList.add("modal-container");
    modal.innerHTML=`<div class="writing-area" placeholder="Enter your Task" contenteditable="true"></div>
    <div class="filter-area">
        <div class="modal-filter pink"></div>
        <div class="modal-filter blue"></div>
        <div class="modal-filter green"></div>
        <div class="modal-filter black active-modal-filter"></div>
    </div>`; 

    let allModalFilter=modal.querySelectorAll(".modal-filter");
    for(let i=0;i<allModalFilter.length;i++)
    {
        allModalFilter[i].addEventListener("click",function(e){
           for(let j=0;j<allModalFilter.length;j++){
               allModalFilter[j].classList.remove("active-modal-filter");
           }
           e.currentTarget.classList.add("active-modal-filter");
        });
    }
   
    let wa=modal.querySelector(".writing-area ");
    wa.addEventListener("keypress",function(e){
        if(e.key=="Enter"){
         let task =e.currentTarget.innerText;
            let selectedModalFilter=document.querySelector(".active-modal-filter");
            let color=selectedModalFilter.classList[1];
            let ticket= document.createElement("div");
            let id= uid()
            ticket.classList.add("ticket");
            ticket.innerHTML=` <div class="ticket-color ${color}"></div>
            <div class="ticket-id">#${id}</div>
            <div class="ticket-box"contenteditable>
            ${task}
            </div>`;
             saveTicketInLocalStorage(id,color,task)
             let ticketWritingArea=ticket.querySelector(".ticket-box");
             ticketWritingArea.addEventListener("input",function(e){
                e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
             })

            ticket.addEventListener("click",function(e){
                if(deleteState)
                {
                    e.currentTarget.remove();
                }
            })

            let TicketColorDiv =ticket.querySelector(".ticket-color")
            TicketColorDiv.addEventListener("click",function(e){
             let currColor=  e.currentTarget.classList[1];
             let index=colorClasses.indexOf(currColor);
             index++;
             index = index%4; 
             e.currentTarget.classList.remove(currColor);
             e.currentTarget.classList.add(colorClasses[index]);

            })

           
            grid.appendChild(ticket);
            modal.remove();  
            modalVisible=false;
        } 
    });
    body.append(modal);
    modalVisible=true;
    });



    for(let i=0;i<filters.length;i++)
    {
        filters[i].addEventListener("click",function(e){
        let color=e.currentTarget.classList[0].split("-")[0] ;    
        grid.style.backgroundColor=colors[color]; 
        })
    }
    
    function saveTicketInLocalStorage(id,color,task){
        let requiredObj ={id,color,task };
        let taskArr= JSON.parse(localStorage.getItem("tasks"))
        taskArr.push(requiredObj);
        localStorage.setItem("tasks",JSON.stringify(taskArr));
    }