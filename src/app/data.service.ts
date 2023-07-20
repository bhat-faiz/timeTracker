import { Injectable } from '@angular/core';
import type { Assignment, ActiveDuration } from './types';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
   
  constructor() { }

  addTask(assignment:Assignment):Assignment[]{
    const assignmentList:Assignment[] = this.loadTasks();
    assignment.id = Date.now().toString()
    assignmentList.push(assignment);
    this.storeTasks(assignmentList)
    return assignmentList
  }

  deleteTask(assignmentId:string):Assignment[]{
    let assignmentList:Assignment[] = this.loadTasks();
    assignmentList = assignmentList.filter(
      (assignment) => assignment.id !== assignmentId
    );
    this.storeTasks(assignmentList)
    return assignmentList;
  }

  getTask():Assignment[]{
    const assignmentList:Assignment[] = this.loadTasks();
    this.storeTasks(assignmentList)
    return assignmentList
  }

  startTask(assignmentId:string):Assignment[]{
    const assignmentList:Assignment[] = this.loadTasks();
    const selectedAssignment:Assignment | undefined = assignmentList.find((assignment) => assignment.id === assignmentId);
    const activeDuration:ActiveDuration = {
      startedAt: Date.now().toString()
    }
    selectedAssignment?.activeDuration?.push(activeDuration);
    selectedAssignment!.isActive = true;
    selectedAssignment!.history.push(`Started the timer at ${this.formatTime(activeDuration.startedAt)} (Active)`)
    this.storeTasks(assignmentList)
    return assignmentList;
  }

  stopTask(assignmentId:string):Assignment[]{
    const assignmentList:Assignment[] = this.loadTasks();
    const selectedAssignment:Assignment | undefined = assignmentList.find((assignment) => assignment.id === assignmentId);
    const activeDuration =  selectedAssignment?.activeDuration.pop();
    activeDuration!.endedAt = Date.now().toString();
    selectedAssignment?.activeDuration.push(activeDuration!);
    selectedAssignment!.isActive = false;
    selectedAssignment!.history.push(`Started the timer at ${this.formatTime(activeDuration!.startedAt)} & Stopped at ${this.formatTime(activeDuration!.endedAt)}`)
    this.storeTasks(assignmentList)
    return assignmentList;
  }

  calculateTotalTime(){
    const assignmentList:Assignment[] = this.loadTasks();
    return assignmentList.reduce((totalTime,item)=>{
      const time = item.activeDuration.reduce((itemTotalTime,duration)=>{
        const endedAt = duration.endedAt ? +duration.endedAt : Date.now() ;
        const startedAt = +duration.startedAt
        const itemTime = endedAt - startedAt;
        return itemTotalTime + itemTime
      },0)
      return totalTime + time
    },0)
  }

  loadTasks(){
    const assignmentListString = localStorage.getItem("assignmentList")
    return assignmentListString ? JSON.parse(assignmentListString) : []
  }

  storeTasks(assignmentList:Assignment[]){
    localStorage.setItem("assignmentList",JSON.stringify(assignmentList))
  }

  formatTime(time:string): string {
    return moment(+time).format("DD/MM/YYYY HH:mm:ss")
  }
}

