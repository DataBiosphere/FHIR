module.exports = {
  makeResource: () => {
    const identifier = {
      name: 'identifier',
      type: 'token',
      fhirtype: 'token',
      xpath: 'Patient.identifier',
      definition: 'http://hl7.org/fhir/SearchParameter/Patient-identifier',
      description: 'A patient identifier',
    };

    const birthdate = {
      name: 'birthdate',
      type: 'date',
      fhirtype: 'date',
      xpath: 'Patient.birthDate',
      definition: 'http://hl7.org/fhir/SearchParameter/individual-birthdate',
      description:
        "Multiple Resources:     * [Patient](patient.html): The patient's date of birth  * [Person](person.html): The person's date of birth  * [RelatedPerson](relatedperson.html): The Related Person's date of birth  ",
    };

    return {
      type: 'Patient',
      profile: {
        reference: 'http://hl7.org/fhir/patient.html',
      },
      searchParam: [identifier, birthdate],
    };
  },
};
