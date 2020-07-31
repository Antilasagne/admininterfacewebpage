let keys=["id", "name","email"];
function getServerData(url){
    let fetchOptions={
        method: "GET",
        mode: "cors",
        cashe:"no-cache",
        credentials:"include"
    };
    return fetch(url, fetchOptions).then(
        response=>response.json(),
        err=>console.error(err)
    );
}

function startGetUsers(){
    getServerData("http://localhost:3000/users").then(
    data=>fillDataTable(data,"usertable"));
}
document.querySelector("#getDataBtn").addEventListener("click", startGetUsers);

function fillDataTable(data,tableID){
    let table=document.querySelector(`#${tableID}`);
    if(!table){
        console.error("Table "+ `#${tableID}` +" is not found.");
        return;
    }
    let tbody=table.querySelector("tbody");
    tbody.innerHTML="";
    let newRow=newUserRow();
    tbody.appendChild(newRow);
    for(let row of data){
        let tr=createAnyElement("tr");
        for(let k of keys){
            let td=createAnyElement("td");
            let input=createAnyElement("input",
            {
                class: "form-control",
                value:row[k],
                name:k
            });
            if(k=="id")
            {
                input.setAttribute("readonly", true);
            td.appendChild(input);
            }else{
            td.appendChild(input);}
            tr.appendChild(td);
        }
        let buttonGrp=createBtnGroup();
        tr.appendChild(buttonGrp);
        tbody.appendChild(tr);
    }
}
function createAnyElement(name, attributes){
    let element=document.createElement(name);
    for(let k in attributes){
        element.setAttribute(k,attributes[k]);
    }
    return element;
}
function createBtnGroup(){
    let group=createAnyElement("div", {class:"btn btn-group"});
    let infoBtn=createAnyElement("button",{class:"btn btn-info", onclick:"setRow(this)"});
    let delBtn=createAnyElement("button",{class:"btn btn-danger", onclick:"delRow(this)"});
    infoBtn.innerHTML='<i class="fa fa-refresh" aria-hidden="true"></i>';
    delBtn.innerHTML='<i class="fa fa-trash" aria-hidden="true"></i>';
    group.appendChild(infoBtn);
    group.appendChild(delBtn);
    let td=createAnyElement("td");
    td.appendChild(group);
    return td;
}
function delRow(el){
    let tr =el.parentElement.parentElement.parentElement;
    let id=tr.querySelector("td:first-child").innerHTML;
    let fetchOptions={
        method: "DELETE",
        mode: "cors",
        cashe:"no-cache",
        credentials:"include"
    }
    fetch(`http://localhost:3000/users/${id}`, fetchOptions).then(
        response=>response.json(),
        err=>console.error(err)
    ).then(
        data=>{
            startGetUsers();
        }
    );
    console.log(tr);
    console.log(id);
}
function newUserRow()
{
    let tr=createAnyElement("tr");
   
    for(let k of keys)
    {
        let td=createAnyElement("td");
        let input=createAnyElement("input", {class:"form-control", name:k});
        td.appendChild(input);
        tr.appendChild(td);
    }
    let newBtn=createAnyElement("button",{class:"btn btn-succes",onclick:"addUser(this)"});
    newBtn.innerHTML='<i class="fa fa-plus-circle" aria-hidden="true"></i>';
    let td=createAnyElement("td");
    td.appendChild(newBtn);
    tr.appendChild(td);
    return tr;
}
function addUser(el)
{
    let tr=el.parentElement.parentElement;
    let data=getRowData(tr);
    let fetchOptions=
    {
        method: "POST",
        mode: "cors",
        cashe:"no-cache",
        headers:
        {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data),
        credentials:"include"
    }
    fetch("http://localhost:3000/users",fetchOptions).then
    (
        response=>response.json(),
        err=>console.error(err)
    ).then
    (
        data=> startGetUsers()
    );
}
function getRowData(tr)
{
    let inputs=tr.querySelectorAll("input.form-control");
    let data={};
    for(let i=0;i<inputs.length;i++)
    {
        data[inputs[i].name]=inputs[i].value;
    }
    return data;
}
function setRow(el)
{
    let tr=el.parentElement.parentElement.parentElement;
    let data=getRowData(tr);
    let fetchOptions={
        method: "PUT",
        mode: "cors",
        cashe:"no-cache",
        headers:
        {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data),
        credentials:"include"
    }
    fetch(`http://localhost:3000/users/${data.id}`,fetchOptions).then
    (
        response=>response.json(),
        err=>console.error(err)
    ).then
    (
        data=>startGetUsers()
    );
}
