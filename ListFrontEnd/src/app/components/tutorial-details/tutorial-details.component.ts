import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-tutorial-details',
  templateUrl: './tutorial-details.component.html',
  styleUrls: ['./tutorial-details.component.css']
})
export class TutorialDetailsComponent implements OnInit {
  @Input() viewMode = false;

  @Input() currentTutorial: Tutorial = {
    title: '',
    description: '',
    published: false,
    name:''
  };

  message='';

  constructor(private tutorialService:TutorialService, private route: ActivatedRoute, private router:Router) { }

  ngOnInit(): void {

    if(!this.viewMode){
      this.message='';
      this.getTutorial(this.route.snapshot.params["id"])
      
    }
  }


getTutorial(id:any):void{

  this.tutorialService.getById(id).subscribe({next:(data)=>{

    this.currentTutorial=data;
    console.log(data);
  },
  error:(e)=>console.error(e)

    })

  }

updatePublished(status:boolean):void{

  const data={
    title:this.currentTutorial.title,
    description:this.currentTutorial.description,
    published:status,
    name:this.currentTutorial.name
    };

    this.message=''
    this.tutorialService.updateTutorial(this.currentTutorial.id,data).subscribe({next:(res)=>{
    
      this.currentTutorial.published=status;
      this.message=res.message?res.message:"Status was updated Successfully"
    },
    error:(e)=>console.error(e)
  })
}

deleteTutorial():void{
  this.tutorialService.deleteTutorial(this.currentTutorial.id).subscribe({next:(res)=>{ 
  
    console.log(res)
    this.router.navigate(['/tutorials'])
  },
  error:(e)=>console.error(e)
  })
}

updateTutorial(){
  this.message='';
  this.tutorialService.updateTutorial(this.currentTutorial.id,this.currentTutorial).subscribe({next:(res)=>{

console.log(res)
this.message=res.message? res.message:"Tutorial Was Update"
  },
  error: (e)=>console.error(e)

})
}

}
