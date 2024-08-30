// RESOURCE: https://observablehq.com/@spencermountain/compromise-match
// RESOURCE: https://observablehq.com/@spencermountain/compromise-match-test
// RESOURCE: https://observablehq.com/@spencermountain/compromise-match-syntax

class regexTemplate {
    static instances = [];
    constructor(name, pattern) {
        this.name = name;
        this.pattern = pattern;
        this.renderedPattern = this.renderPattern();
        this.constructor.instances.push(this);
    }
    renderPattern(pattern = this.pattern) {
        const templateReferenceRegEx = new RegExp(`%[a-zA-Z]+`, 'g');
        const templateReferences = pattern.match(templateReferenceRegEx);
        const uniqueTemplateReferences = [...new Set(templateReferences)];
        const templateReferencesRepeats = uniqueTemplateReferences?.reduce((acc, reference) => {
            acc[reference] = 0;
            return acc;
        }, {});
        if (!templateReferences) {
            return pattern;
        }
        for (const reference of templateReferences) {
            // Get referenced template object
            const referencedTemplateName = reference.replace('%', '');
            const referencedTemplateIndex = templateReferencesRepeats[reference];
            const referencedTemplateObject = regexTemplate.instances.find(instance => instance.name === referencedTemplateName);
            // Raise error if referenced template not found
            if (!referencedTemplateObject) {
                throw new Error(`Failed to render template ${this.name}: Referenced template ${referencedTemplateName} not found. Make sure the referenced template is defined before the current template. \n available templates: ${regexTemplate.instances.map(instance => instance.name)}`);
            }
            // Get referenced template pattern and prefix group names with the current template name
            const wrappedReferencedTemplatePattern = this.wrapTemplatePattern(referencedTemplateObject);

            const namedReferencedTemplatePattern = `(?<${this.name + referencedTemplateIndex + referencedTemplateName}>${wrappedReferencedTemplatePattern})`;
            pattern = pattern.replace(reference, namedReferencedTemplatePattern);
            templateReferencesRepeats[reference] = templateReferencesRepeats[reference] + 1;

        }
        return this.renderPattern(pattern);
    }

    wrapTemplatePattern = (template) => {
        const patternTemplateName = template.name;
        let pattern = template.renderedPattern;

        const namedGroups = pattern.match(/\(\?<([\w]+)/g)?.map(group => group.replace(/\(\?|<|>/g, ''));
        const uniqueNamedGroups = [...new Set(namedGroups)];
        const namedGroupsRepeats = uniqueNamedGroups?.reduce((acc, groupName) => {
            acc[groupName] = 0;
            return acc;
        }, {});

        if (namedGroups) {
            for (const groupName of namedGroups) {
                const groupIndex = namedGroupsRepeats[groupName];

                if (groupName == this.name) {
                    continue;
                }
                pattern = pattern.replace(`<${groupName}`, `<${this.name + groupIndex + groupName}`);

                namedGroupsRepeats[groupName] = namedGroupsRepeats[groupName] + 1;
            }

        }

        return pattern;
    }
}

const promises = [
    "I will read 1 book daily",
    "I will make a YouTube video",
    "I will clean the house every Monday for a month",
    "I will run",
    "I will practice guitar every other day",
    "I will study for 3 hours",
    "I will call my friend every weekend",
    "I will organize the garage next year",
    "I will walk 10,000 steps each day",
    "I will cook dinner twice a week",
    "I will write an essay every month",
    "I will paint 2 paintings by the end of summer",
    "I will visit the dentist every six months",
    "I will stretch for 15 minutes before bed",
    "I will finish the project",
    "I will meditate for 10 minutes daily",
    "I will vacuum the living room at least once a week",
    "I will water the plants every morning and evening",
    "I will watch a documentary each Sunday night",
    "I will read before sleeping",
    "I will do 5 push-ups every day",
    "I will learn a new word weekly",
    "I will bake cookies every holiday season",
    "I will attend a workshop sometime this year",
    "I will donate clothes every season",
    "I will jog in the park after work",
    "I will create 10 new sketches next month",
    "I will fix the sink next weekend",
    "I will feed the cat twice a day",
    "I will start a new hobby in January",
    "I will drink water",
    "I will cut 500 calories daily for 7 days",
    "I will do 5 pushups every day for 5 weeks",
];


// Function to decompose a sentence
function decomposeSentence(sentence) {
    const text = sentence.trim();
    const doc = nlp(text)
    
    const frequencyRegexTemplate = new regexTemplate("frequency", `%count?%optionalSpace%interval`);
    const frequencyRegExPattern = frequencyRegexTemplate.renderedPattern;


    return {
        sentence: text,
        frequencyNLP: doc.match('[(in|every|each)]? [(once|twice)]? [a]? [#Value]? [(#Date|#Duration)]').out('list'),
        frequencyRegEx: text.match(new RegExp(frequencyRegExPattern, 'i'))?.groups,
        // actor: doc.match(`/${frequencyRegExPattern}/`).out('text'),
        // act: doc.match('#Auxiliary? #Verb+').out('text'),
        // object: doc.match('#Verb (#Noun+)').out('text'),
        // frequency: doc.match('((every|each|weekly|daily|monthly|yearly|sometime|once)(?:\d+)?(?:\s?)(?:year|month|week|day|minute|second)(?:s?))').out('text'),
        // duration: doc.match('#Value #Time').out('text'),
        // time: doc.match('#Date').out('text'),
        // from: doc.match('from #Date').out('text'),
        // to: doc.match('to #Date').out('text'),
    }
}


const numericalQuantity = new regexTemplate("NumQyt", `[\\d,]+ \\w+?`);
const quantity = new regexTemplate("Qyt", `twice|once|%NumQyt`);
const timeAdverb = new regexTemplate("TimeAdverb", `daily|weekly|monthly|yearly`);
const quantifier = new regexTemplate("quantifier", `every|each|a`);
const alternating = new regexTemplate("alternating", `other`);
const pluralQuantifier = new regexTemplate("pluralQuantifier", `every|each`);
const timeUnit = new regexTemplate("timeUnit", `year|month|week|day|minute|second`);
const optionalSpace = new regexTemplate("optionalSpace", `\\s?`);
const digits = new regexTemplate("digits", `\\d+`);
const plural = new regexTemplate("plural", `s|es`);

const count = new regexTemplate("count", `%Qyt`);
const interval = new regexTemplate("interval", [
    `%pluralQuantifier%optionalSpace%timeUnit`,
    `%pluralQuantifier%optionalSpace%digits%optionalSpace%timeUnit%plural`,
    `%TimeAdverb`,
    `%pluralQuantifier%optionalSpace%alternating%optionalSpace%timeUnit`
].join('|'));
const frequency = new regexTemplate("frequency", `%count?%optionalSpace%interval`);

// Process all sentences
const decomposedSentences = promises.map(decomposeSentence);
console.log(decomposedSentences);