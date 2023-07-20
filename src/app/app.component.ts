import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import type { Assignment } from './types';
import { DataService } from './data.service';
import moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  ngOnInit(): void {
    this.assignmentData = this.data.getTask();
    setInterval(()=>{
      this.currentTime = Date.now()
    }, 1000)
  }

  taskName:string = ""
  assignmentData:Assignment[] = []
  currentTime = Date.now()


  constructor (private modalService:NgbModal,public data:DataService) {}
  
  open(content: any) {
		this.modalService.open(content, { size:'lg',centered: true }).result.then((isSubmit:boolean) => {},(reason) => {},);
	}

  getTimer(startedTime:string):string {
    const duration = moment.duration(Math.abs(this.currentTime - +startedTime))
    return `${this.formatTime(duration.hours())}:${this.formatTime(duration.minutes())}:${this.formatTime(duration.seconds())}`
  }

  formatTime(unit:number) {
    return unit.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})
  }

  onSubmit(){
    this.assignmentData = this.data.addTask({
      id:"",
      taskName: this.taskName,
      activeDuration:[],
      history: [],
      isActive:false
    })
    console.log(this.assignmentData);
    this.taskName = ""
    this.modalService.dismissAll();
  }

  startTimer(id:string){
    this.assignmentData = this.data.startTask(id);
    console.log(this.assignmentData);
  }

  stopTimer(id:string){
    this.assignmentData = this.data.stopTask(id);
    console.log(this.assignmentData);
  }

  deleteTask(id:string){
    this.assignmentData = this.data.deleteTask(id);
    console.log(this.assignmentData);
  }

  calculateTotalTime() {
    const duration = moment.duration(Math.abs(this.data.calculateTotalTime()))
    return `${this.formatTime(duration.hours())} hr ${this.formatTime(duration.minutes())} min`
  }
}
