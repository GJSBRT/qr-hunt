import { DatabaseObject } from "@/types";

export interface TerritoryMission extends DatabaseObject {
    territory_id: number;
    title: string;
    description: string;
    answer_type: 'multiple_choice' | 'open_answer' | 'photo'
};

export type NewTerritoryMission = Omit<TerritoryMission, keyof DatabaseObject | 'territory_id'>;

export interface TerritoryMissionAnswer extends DatabaseObject {
    territory_mission_id: number;
    team_id: number;
    multiple_choice_id: number|null;
    photo: string|null;
    open_answer: string|null;
    marked_correct: boolean|null;
}

export type NewTerritoryMissionAnswer = Omit<TerritoryMissionAnswer, keyof DatabaseObject | 'territory_mission_id' | 'team_id' | 'marked_correct'> 

export interface TerritoryMissionMultipleChoiceAnswer extends DatabaseObject {
    territory_mission_id: number;
    answer: string;
    correct: boolean;
}
