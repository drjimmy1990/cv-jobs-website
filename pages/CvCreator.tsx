import React, { useState } from 'react';
import { Plus, X, Save, Loader, Briefcase, GraduationCap, Award, Globe, Code, FileText, User, Trash2, Layout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { CvData, CustomSection } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const CvCreator: React.FC = () => {
    const { user } = useAuth();
    const { t, isRTL } = useLanguage();
    const [loading, setLoading] = useState(false);

    // Track which optional sections are visible
    const [activeSections, setActiveSections] = useState({
        summary: true,
        experience: true,
        education: true,
        skills: true,
        languages: true,
        projects: true,
        certifications: true,
        awards: true,
        hobbies: true,
        references: false // Hidden by default
    });

    // Initial Data
    const [formData, setFormData] = useState<CvData>({
        fullName: '', jobTitle: '', email: '', phone: '', location: '', linkedin: '', photoBase64: '',
        summary: '',
        experience: [{ title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }],
        education: [{ institution: '', degree: '', field: '', gradDate: '', gpa: '' }],
        skills: [{ name: '' }],
        languages: [{ name: '', proficiency: '' }],
        projects: [{ name: '', date: '', description: '', link: '' }],
        certifications: [{ name: '', org: '', date: '', link: '' }],
        awards: [{ name: '', org: '', year: '' }],
        hobbies: '',
        references: '',
        customSections: []
    });

    // --- Handlers ---

    const toggleSection = (section: keyof typeof activeSections, isVisible: boolean) => {
        setActiveSections(prev => ({ ...prev, [section]: isVisible }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, photoBase64: reader.result as string });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // Generic Array Updater
    const updateArray = (section: keyof CvData, index: number, field: string, value: any) => {
        // @ts-ignore
        const newArray = [...formData[section]];
        newArray[index] = { ...newArray[index], [field]: value };
        setFormData({ ...formData, [section]: newArray });
    };

    const addItem = (section: keyof CvData, emptyItem: any) => {
        // @ts-ignore
        setFormData({ ...formData, [section]: [...formData[section], emptyItem] });
    };

    const removeItem = (section: keyof CvData, index: number) => {
        // @ts-ignore
        const newArray = [...formData[section]];
        newArray.splice(index, 1);
        setFormData({ ...formData, [section]: newArray });
    };

    // Custom Section Handlers
    const addCustomSection = () => {
        const newSection: CustomSection = {
            id: Date.now().toString(),
            title: '',
            items: [{ title: '', description: '', fields: [] }]
        };
        setFormData({ ...formData, customSections: [...formData.customSections, newSection] });
    };

    const removeCustomSection = (index: number) => {
        const newSections = [...formData.customSections];
        newSections.splice(index, 1);
        setFormData({ ...formData, customSections: newSections });
    };

    const updateCustomSection = (index: number, field: keyof CustomSection, value: any) => {
        const newSections = [...formData.customSections];
        newSections[index] = { ...newSections[index], [field]: value };
        setFormData({ ...formData, customSections: newSections });
    };

    const addCustomItem = (sectionIndex: number) => {
        const newSections = [...formData.customSections];
        newSections[sectionIndex].items.push({ title: '', description: '', fields: [] });
        setFormData({ ...formData, customSections: newSections });
    };

    const removeCustomItem = (sectionIndex: number, itemIndex: number) => {
        const newSections = [...formData.customSections];
        newSections[sectionIndex].items.splice(itemIndex, 1);
        setFormData({ ...formData, customSections: newSections });
    };

    const updateCustomItem = (sectionIndex: number, itemIndex: number, field: string, value: any) => {
        const newSections = [...formData.customSections];
        newSections[sectionIndex].items[itemIndex] = { ...newSections[sectionIndex].items[itemIndex], [field]: value };
        setFormData({ ...formData, customSections: newSections });
    };

    const addCustomField = (sectionIndex: number, itemIndex: number) => {
        const newSections = [...formData.customSections];
        newSections[sectionIndex].items[itemIndex].fields.push({ label: '', value: '' });
        setFormData({ ...formData, customSections: newSections });
    };

    const removeCustomField = (sectionIndex: number, itemIndex: number, fieldIndex: number) => {
        const newSections = [...formData.customSections];
        newSections[sectionIndex].items[itemIndex].fields.splice(fieldIndex, 1);
        setFormData({ ...formData, customSections: newSections });
    };

    const updateCustomField = (sectionIndex: number, itemIndex: number, fieldIndex: number, key: 'label' | 'value', newValue: string) => {
        const newSections = [...formData.customSections];
        newSections[sectionIndex].items[itemIndex].fields[fieldIndex][key] = newValue;
        setFormData({ ...formData, customSections: newSections });
    };

    const handleSubmit = async (previewMode: boolean) => {
        if (!user) return alert("Please login first");
        setLoading(true);
        try {
            const response = await api.createCvFromData(formData, user.id);

            if (response.downloadUrl) {
                window.open(response.downloadUrl, '_blank');
            } else {
                alert("CV Generated, but URL missing.");
            }
        } catch (error) {
            alert("Failed to generate CV. Ensure n8n is running.");
        } finally {
            setLoading(false);
        }
    };

    // --- Styles ---
    const cardClass = "bg-white rounded-xl p-8 border border-gray-200 shadow-md relative transition-all duration-300";
    const sectionTitleClass = "text-2xl font-bold text-primary flex items-center gap-2";
    const labelClass = "block text-sm font-semibold text-charcoal mb-1.5";
    const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all";
    const removeSectionBtn = "p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors";

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-primary mb-2">{t('cvCreator.title')}</h1>
                    <p className="text-gray-600">{t('cvCreator.pageSubtitle')}</p>
                </div>

                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>

                    {/* 1. Personal Info (Always Visible) */}
                    <div className={`${cardClass} border-l-4 border-l-primary`}>
                        <div className="flex justify-between items-start mb-6">
                            <h2 className={sectionTitleClass}><User size={24} /> {t('cvCreator.personalInfo')}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>{t('cvCreator.fullName')} <span className="text-red-500">*</span></label>
                                <input name="fullName" value={formData.fullName} onChange={handleChange} className={inputClass} placeholder="John Doe" required />
                            </div>
                            <div>
                                <label className={labelClass}>{t('cvCreator.jobTitle')}</label>
                                <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} className={inputClass} placeholder="Software Engineer" />
                            </div>
                            <div>
                                <label className={labelClass}>{t('cvCreator.email')} <span className="text-red-500">*</span></label>
                                <input name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="email@example.com" type="email" required />
                            </div>
                            <div>
                                <label className={labelClass}>{t('cvCreator.phone')}</label>
                                <input name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+1 234 567 890" />
                            </div>
                            <div>
                                <label className={labelClass}>{t('cvCreator.location')}</label>
                                <input name="location" value={formData.location} onChange={handleChange} className={inputClass} placeholder="City, Country" />
                            </div>
                            <div>
                                <label className={labelClass}>{t('cvCreator.linkedin')}</label>
                                <input name="linkedin" value={formData.linkedin} onChange={handleChange} className={inputClass} placeholder="https://linkedin.com/in/..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>{t('cvCreator.photo')}</label>
                                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* 2. Summary */}
                    {activeSections.summary && (
                        <div className={cardClass}>
                            <div className="flex justify-between items-start mb-6">
                                <h2 className={sectionTitleClass}><FileText size={24} /> {t('cvCreator.summary')}</h2>
                                <button type="button" onClick={() => toggleSection('summary', false)} className={removeSectionBtn} title={t('cvCreator.removeSection')}><Trash2 size={20} /></button>
                            </div>
                            <textarea name="summary" value={formData.summary} onChange={handleChange} className={`${inputClass} min-h-[120px]`} placeholder={t('cvCreator.summary') + "..."} />
                        </div>
                    )}

                    {/* 3. Work Experience */}
                    {activeSections.experience && (
                        <div className={cardClass}>
                            <div className="flex justify-between items-start mb-6">
                                <h2 className={sectionTitleClass}><Briefcase size={24} /> {t('cvCreator.experience')}</h2>
                                <button type="button" onClick={() => toggleSection('experience', false)} className={removeSectionBtn} title={t('cvCreator.removeSection')}><Trash2 size={20} /></button>
                            </div>
                            <div className="space-y-6">
                                {formData.experience.map((exp, idx) => (
                                    <div key={idx} className="p-6 bg-gray-50 rounded-xl border border-gray-200 relative">
                                        {formData.experience.length > 1 && (
                                            <button onClick={() => removeItem('experience', idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><X size={18} /></button>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelClass}>{t('cvCreator.jobTitle')}</label>
                                                <input value={exp.title} onChange={(e) => updateArray('experience', idx, 'title', e.target.value)} className={inputClass} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>{t('cvCreator.organization')}</label>
                                                <input value={exp.company} onChange={(e) => updateArray('experience', idx, 'company', e.target.value)} className={inputClass} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>{t('cvCreator.location')}</label>
                                                <input value={exp.location} onChange={(e) => updateArray('experience', idx, 'location', e.target.value)} className={inputClass} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>{t('cvCreator.startDate')}</label>
                                                <input type="date" value={exp.startDate} onChange={(e) => updateArray('experience', idx, 'startDate', e.target.value)} className={inputClass} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>{t('cvCreator.endDate')}</label>
                                                <input type="date" value={exp.endDate} onChange={(e) => updateArray('experience', idx, 'endDate', e.target.value)} className={inputClass} disabled={exp.current} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" checked={exp.current} onChange={(e) => updateArray('experience', idx, 'current', e.target.checked)} className="rounded text-primary focus:ring-secondary" />
                                                    <span className="text-sm text-gray-700">{t('cvCreator.currentWork')}</span>
                                                </label>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className={labelClass}>{t('cvCreator.responsibilities')}</label>
                                                <textarea value={exp.description} onChange={(e) => updateArray('experience', idx, 'description', e.target.value)} className={`${inputClass} min-h-[100px]`} placeholder="• Achieved X..." />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => addItem('experience', { title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' })} className="mt-4 flex items-center gap-2 text-secondary font-bold hover:text-teal-600 transition-colors">
                                <Plus size={18} /> {t('cvCreator.addPosition')}
                            </button>
                        </div>
                    )}

                    {/* 4. Education */}
                    {activeSections.education && (
                        <div className={cardClass}>
                            <div className="flex justify-between items-start mb-6">
                                <h2 className={sectionTitleClass}><GraduationCap size={24} /> {t('cvCreator.education')}</h2>
                                <button type="button" onClick={() => toggleSection('education', false)} className={removeSectionBtn} title={t('cvCreator.removeSection')}><Trash2 size={20} /></button>
                            </div>
                            <div className="space-y-6">
                                {formData.education.map((edu, idx) => (
                                    <div key={idx} className="p-6 bg-gray-50 rounded-xl border border-gray-200 relative">
                                        {formData.education.length > 1 && (
                                            <button onClick={() => removeItem('education', idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><X size={18} /></button>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelClass}>{t('cvCreator.institution')}</label>
                                                <input value={edu.institution} onChange={(e) => updateArray('education', idx, 'institution', e.target.value)} className={inputClass} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>{t('cvCreator.degree')}</label>
                                                <input value={edu.degree} onChange={(e) => updateArray('education', idx, 'degree', e.target.value)} className={inputClass} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>{t('cvCreator.field')}</label>
                                                <input value={edu.field} onChange={(e) => updateArray('education', idx, 'field', e.target.value)} className={inputClass} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>{t('cvCreator.gradDate')}</label>
                                                <input type="date" value={edu.gradDate} onChange={(e) => updateArray('education', idx, 'gradDate', e.target.value)} className={inputClass} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>{t('cvCreator.gpa')}</label>
                                                <input value={edu.gpa} onChange={(e) => updateArray('education', idx, 'gpa', e.target.value)} className={inputClass} placeholder="3.8/4.0" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => addItem('education', { institution: '', degree: '', field: '', gradDate: '', gpa: '' })} className="mt-4 flex items-center gap-2 text-secondary font-bold hover:text-teal-600 transition-colors">
                                <Plus size={18} /> {t('cvCreator.addEducation')}
                            </button>
                        </div>
                    )}

                    {/* 5. Skills & Languages */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {activeSections.skills && (
                            <div className={cardClass}>
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className={sectionTitleClass}><Code size={24} /> {t('cvCreator.skills')}</h2>
                                    <button type="button" onClick={() => toggleSection('skills', false)} className={removeSectionBtn} title={t('cvCreator.removeSection')}><Trash2 size={20} /></button>
                                </div>
                                {formData.skills.map((skill, idx) => (
                                    <div key={idx} className="flex gap-2 mb-3 items-end">
                                        <div className="flex-1">
                                            <input value={skill.name} onChange={(e) => updateArray('skills', idx, 'name', e.target.value)} className={inputClass} placeholder="e.g. React" />
                                        </div>
                                        {formData.skills.length > 1 && <button onClick={() => removeItem('skills', idx)} className="text-red-400 p-2"><X size={18} /></button>}
                                    </div>
                                ))}
                                <button onClick={() => addItem('skills', { name: '' })} className="text-secondary font-bold text-sm flex items-center gap-1"><Plus size={16} /> {t('cvCreator.addSkill')}</button>
                            </div>
                        )}

                        {activeSections.languages && (
                            <div className={cardClass}>
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className={sectionTitleClass}><Globe size={24} /> {t('cvCreator.languages')}</h2>
                                    <button type="button" onClick={() => toggleSection('languages', false)} className={removeSectionBtn} title={t('cvCreator.removeSection')}><Trash2 size={20} /></button>
                                </div>
                                {formData.languages.map((lang, idx) => (
                                    <div key={idx} className="flex gap-2 mb-3 items-end">
                                        <div className="flex-1">
                                            <input value={lang.name} onChange={(e) => updateArray('languages', idx, 'name', e.target.value)} className={inputClass} placeholder="Language" />
                                        </div>
                                        <div className="flex-1">
                                            <select value={lang.proficiency} onChange={(e) => updateArray('languages', idx, 'proficiency', e.target.value)} className={inputClass}>
                                                <option value="">{t('cvCreator.proficiency')}</option>
                                                <option value="Native">Native</option>
                                                <option value="Fluent">Fluent</option>
                                                <option value="Conversational">Conversational</option>
                                            </select>
                                        </div>
                                        {formData.languages.length > 1 && <button onClick={() => removeItem('languages', idx)} className="text-red-400 p-2"><X size={18} /></button>}
                                    </div>
                                ))}
                                <button onClick={() => addItem('languages', { name: '', proficiency: '' })} className="text-secondary font-bold text-sm flex items-center gap-1"><Plus size={16} /> {t('cvCreator.addLanguage')}</button>
                            </div>
                        )}
                    </div>

                    {/* 6. Certifications */}
                    {activeSections.certifications && (
                        <div className={cardClass}>
                            <div className="flex justify-between items-start mb-6">
                                <h2 className={sectionTitleClass}><Award size={24} /> {t('cvCreator.certifications')}</h2>
                                <button type="button" onClick={() => toggleSection('certifications', false)} className={removeSectionBtn} title={t('cvCreator.removeSection')}><Trash2 size={20} /></button>
                            </div>
                            <div className="space-y-6">
                                {formData.certifications.map((cert, idx) => (
                                    <div key={idx} className="p-6 bg-gray-50 rounded-xl border border-gray-200 relative">
                                        {formData.certifications.length > 1 && (
                                            <button onClick={() => removeItem('certifications', idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><X size={18} /></button>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelClass}>{t('cvCreator.certName')} <span className="text-red-500">*</span></label>
                                                <input value={cert.name} onChange={(e) => updateArray('certifications', idx, 'name', e.target.value)} className={inputClass} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>{t('cvCreator.issuingOrg')} <span className="text-red-500">*</span></label>
                                                <input value={cert.org} onChange={(e) => updateArray('certifications', idx, 'org', e.target.value)} className={inputClass} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>{t('cvCreator.completionDate')}</label>
                                                <input type="date" value={cert.date} onChange={(e) => updateArray('certifications', idx, 'date', e.target.value)} className={inputClass} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>{t('cvCreator.verificationLink')}</label>
                                                <input value={cert.link} onChange={(e) => updateArray('certifications', idx, 'link', e.target.value)} className={inputClass} placeholder="https://..." />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => addItem('certifications', { name: '', org: '', date: '', link: '' })} className="mt-4 flex items-center gap-2 text-secondary font-bold hover:text-teal-600 transition-colors">
                                <Plus size={18} /> {t('cvCreator.addCertification')}
                            </button>
                        </div>
                    )}

                    {/* 7. Personal Projects */}
                    {activeSections.projects && (
                        <div className={cardClass}>
                            <div className="flex justify-between items-start mb-6">
                                <h2 className={sectionTitleClass}><Code size={24} /> {t('cvCreator.projects')}</h2>
                                <button type="button" onClick={() => toggleSection('projects', false)} className={removeSectionBtn} title={t('cvCreator.removeSection')}><Trash2 size={20} /></button>
                            </div>
                            <div className="space-y-6">
                                {formData.projects.map((proj, idx) => (
                                    <div key={idx} className="p-6 bg-gray-50 rounded-xl border border-gray-200 relative">
                                        {formData.projects.length > 1 && (
                                            <button onClick={() => removeItem('projects', idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><X size={18} /></button>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelClass}>{t('cvCreator.projectName')} <span className="text-red-500">*</span></label>
                                                <input value={proj.name} onChange={(e) => updateArray('projects', idx, 'name', e.target.value)} className={inputClass} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>{t('cvCreator.projectDate')}</label>
                                                <input type="date" value={proj.date} onChange={(e) => updateArray('projects', idx, 'date', e.target.value)} className={inputClass} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className={labelClass}>{t('cvCreator.description')} <span className="text-red-500">*</span></label>
                                                <textarea value={proj.description} onChange={(e) => updateArray('projects', idx, 'description', e.target.value)} className={`${inputClass} min-h-[100px]`} placeholder={t('cvCreator.description') + "..."} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className={labelClass}>{t('cvCreator.projectLink')}</label>
                                                <input value={proj.link} onChange={(e) => updateArray('projects', idx, 'link', e.target.value)} className={inputClass} placeholder="https://..." />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => addItem('projects', { name: '', date: '', description: '', link: '' })} className="mt-4 flex items-center gap-2 text-secondary font-bold hover:text-teal-600 transition-colors">
                                <Plus size={18} /> {t('cvCreator.addProject')}
                            </button>
                        </div>
                    )}

                    {/* 8. Awards */}
                    {activeSections.awards && (
                        <div className={cardClass}>
                            <div className="flex justify-between items-start mb-6">
                                <h2 className={sectionTitleClass}><Award size={24} /> {t('cvCreator.awards')}</h2>
                                <button type="button" onClick={() => toggleSection('awards', false)} className={removeSectionBtn} title={t('cvCreator.removeSection')}><Trash2 size={20} /></button>
                            </div>
                            <div className="space-y-4">
                                {formData.awards.map((award, idx) => (
                                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-gray-50 p-4 rounded-lg relative">
                                        {formData.awards.length > 1 && <button onClick={() => removeItem('awards', idx)} className="absolute top-2 right-2 text-red-400"><X size={16} /></button>}
                                        <div>
                                            <label className="text-xs font-bold text-gray-500">{t('cvCreator.awardName')}</label>
                                            <input value={award.name} onChange={(e) => updateArray('awards', idx, 'name', e.target.value)} className={inputClass} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500">{t('cvCreator.organization')}</label>
                                            <input value={award.org} onChange={(e) => updateArray('awards', idx, 'org', e.target.value)} className={inputClass} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500">{t('cvCreator.year')}</label>
                                            <input value={award.year} onChange={(e) => updateArray('awards', idx, 'year', e.target.value)} className={inputClass} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => addItem('awards', { name: '', org: '', year: '' })} className="mt-4 flex items-center gap-2 text-secondary font-bold"><Plus size={18} /> {t('cvCreator.addAward')}</button>
                        </div>
                    )}

                    {/* 9. Extra Details */}
                    {(activeSections.hobbies || activeSections.references) && (
                        <div className={cardClass}>
                            <h2 className={sectionTitleClass}>{t('cvCreator.hobbies')} / {t('cvCreator.references')}</h2>
                            <div className="grid md:grid-cols-2 gap-6 mt-4">
                                {activeSections.hobbies && (
                                    <div className="relative">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className={labelClass}>{t('cvCreator.hobbies')}</label>
                                            <button type="button" onClick={() => toggleSection('hobbies', false)} className="text-red-300 hover:text-red-500"><X size={16} /></button>
                                        </div>
                                        <textarea name="hobbies" value={formData.hobbies} onChange={handleChange} className={`${inputClass} min-h-[80px]`} placeholder="Reading, Chess, Hiking..." />
                                    </div>
                                )}
                                {activeSections.references && (
                                    <div className="relative">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className={labelClass}>{t('cvCreator.references')}</label>
                                            <button type="button" onClick={() => toggleSection('references', false)} className="text-red-300 hover:text-red-500"><X size={16} /></button>
                                        </div>
                                        <textarea name="references" value={formData.references} onChange={handleChange} className={`${inputClass} min-h-[80px]`} placeholder="Available upon request..." />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 10. Custom Sections */}
                    {formData.customSections.map((section, sectionIndex) => (
                        <div key={section.id} className={cardClass}>
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-2 flex-1">
                                    <Layout size={24} className="text-primary" />
                                    <input
                                        value={section.title}
                                        onChange={(e) => updateCustomSection(sectionIndex, 'title', e.target.value)}
                                        className="text-2xl font-bold text-primary bg-transparent border-b border-gray-300 focus:border-secondary outline-none w-full max-w-md"
                                        placeholder={t('cvCreator.sectionTitle')}
                                    />
                                </div>
                                <button type="button" onClick={() => removeCustomSection(sectionIndex)} className={removeSectionBtn} title={t('cvCreator.removeSection')}><Trash2 size={20} /></button>
                            </div>
                            <div className="space-y-6">
                                {section.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="p-6 bg-gray-50 rounded-xl border border-gray-200 relative">
                                        <button onClick={() => removeCustomItem(sectionIndex, itemIndex)} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><X size={18} /></button>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <label className={labelClass}>{t('cvCreator.itemTitle')}</label>
                                                <input value={item.title} onChange={(e) => updateCustomItem(sectionIndex, itemIndex, 'title', e.target.value)} className={inputClass} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>{t('cvCreator.description')}</label>
                                                <textarea value={item.description} onChange={(e) => updateCustomItem(sectionIndex, itemIndex, 'description', e.target.value)} className={`${inputClass} min-h-[80px]`} />
                                            </div>

                                            {/* Dynamic Fields */}
                                            {item.fields.map((field, fieldIndex) => (
                                                <div key={fieldIndex} className="flex gap-2 items-end">
                                                    <div className="flex-1">
                                                        <label className={labelClass}>{t('cvCreator.fieldLabel')}</label>
                                                        <input value={field.label} onChange={(e) => updateCustomField(sectionIndex, itemIndex, fieldIndex, 'label', e.target.value)} className={inputClass} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className={labelClass}>{t('cvCreator.fieldValue')}</label>
                                                        <input value={field.value} onChange={(e) => updateCustomField(sectionIndex, itemIndex, fieldIndex, 'value', e.target.value)} className={inputClass} />
                                                    </div>
                                                    <button type="button" onClick={() => removeCustomField(sectionIndex, itemIndex, fieldIndex)} className="p-2.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title={t('cvCreator.removeField')}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => addCustomField(sectionIndex, itemIndex)} className="text-sm font-bold text-secondary flex items-center gap-1 hover:underline">
                                                <Plus size={14} /> {t('cvCreator.addField')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => addCustomItem(sectionIndex)} className="mt-4 flex items-center gap-2 text-secondary font-bold"><Plus size={18} /> {t('cvCreator.addItem')}</button>
                        </div>
                    ))}

                    {/* ADD SECTIONS MENU */}
                    <div className="flex flex-wrap gap-3 justify-center py-4 bg-white/50 rounded-xl border border-dashed border-gray-300">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider w-full text-center mb-1">{t('cvCreator.addSection')}</span>
                        {!activeSections.experience && <button onClick={() => toggleSection('experience', true)} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-colors">+ {t('cvCreator.experience')}</button>}
                        {!activeSections.education && <button onClick={() => toggleSection('education', true)} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-colors">+ {t('cvCreator.education')}</button>}
                        {!activeSections.skills && <button onClick={() => toggleSection('skills', true)} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-colors">+ {t('cvCreator.skills')}</button>}
                        {!activeSections.languages && <button onClick={() => toggleSection('languages', true)} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-colors">+ {t('cvCreator.languages')}</button>}
                        {!activeSections.certifications && <button onClick={() => toggleSection('certifications', true)} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-colors">+ {t('cvCreator.certifications')}</button>}
                        {!activeSections.projects && <button onClick={() => toggleSection('projects', true)} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-colors">+ {t('cvCreator.projects')}</button>}
                        {!activeSections.awards && <button onClick={() => toggleSection('awards', true)} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-colors">+ {t('cvCreator.awards')}</button>}
                        {!activeSections.hobbies && <button onClick={() => toggleSection('hobbies', true)} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-colors">+ {t('cvCreator.hobbies')}</button>}
                        {!activeSections.references && <button onClick={() => toggleSection('references', true)} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-colors">+ {t('cvCreator.references')}</button>}
                        <button onClick={addCustomSection} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-secondary hover:text-secondary transition-colors">+ {t('cvCreator.addCustomSection')}</button>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center pt-8 sticky bottom-4 z-10">
                        <button
                            onClick={() => handleSubmit(false)}
                            disabled={loading}
                            className="w-full md:w-1/2 bg-primary hover:bg-blue-800 text-white h-14 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] disabled:opacity-70"
                        >
                            {loading ? <Loader className="animate-spin" /> : <><Save /> {t('cvCreator.saveGenerate')}</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};