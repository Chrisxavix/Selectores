import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Region } from '../../interfaces/country.interfaces';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrl: './selector-page.component.css'
})
export class SelectorPageComponent implements OnInit{

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
  ) {}

  public regions: Region[] = [];

  public myForm: FormGroup = this.fb.group({
    region: ["", Validators.required],
    country: ["", Validators.required],
    borders: ["", Validators.required]
  })

  ngOnInit(): void {
    this.regions = this.countriesService.getRegions();
    console.log(this.regions, " brou");
  }


}
