import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import LeftNavBar from "./LeftNavBar";
import chat1 from "../../assets/images/chat1.png";
import navy_bg from "../../assets/images/navy_bg.jpg";
import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Cookies from 'js-cookie';
import Moment from "../../plugin/Moment";
import Toast from "../../plugin/Toast";
import Swal from "sweetalert2";
import PlagiarismChecker from "../../components/PlagiarismChecker";
import PlagiarismResults from "../../components/PlagiarismResults";
import Loader from "../../components/Loader";


function Projects(){

    // initiatialization 
    const accessToken = Cookies.get('access_token');
    const [category, setCategory] = useState([])

    // sets and hold the projects associated to the user
    const [myprojects, setmyProjects] = useState([])

    // sets and hold the details of projects to be uploaded
    const [newproject, setNewProject ] = useState({
        title: "",
        category: parseInt(""),
        description: "",
        level: "",
        price: "",
        keywords: "",
        co_authors: "",
        table_of_content: null,
        project_content: null,
    })

    // set and hold state of processing 
    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState({
        table_of_content: null,
        project_content: null
    })
    
    // Plagiarism checker states
    const [showPlagiarismChecker, setShowPlagiarismChecker] = useState(false)
    const [showPlagiarismResults, setShowPlagiarismResults] = useState(false)
    const [selectedProjectForCheck, setSelectedProjectForCheck] = useState(null)

    // asynchronous function for fetching projects associated with the user 
    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [projectsResponse, categoriesResponse] = await Promise.all([
                apiInstance.get("user/project",
                    // includes JWT 
                    { headers: { 
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${accessToken}`
                    }}
                ),
                // get categories dynamically
                apiInstance.get("/categories"),
              ]
            );

            // set response data 
            setmyProjects(projectsResponse.data.results);
            setCategory(categoriesResponse.data.results);
            setIsLoading(false)

        } catch (error) {
            // returns appropriate error 
            Toast("error", error.response?.data?.message || "An error occurred");
            setIsLoading(false)
        }
    }

    // handles changes of input elements 
    const handleChange = (event) => {
        setNewProject ({
            ...newproject,
            // dynamically sets the name and value of each form field on change 
            [event.target.name]: event.target.value,
        });
    }

    // handles changes of input file 
    const handleFileChange = (event) => {
        // extract the file from the input element 
        const selectedfile = event.target.files[0];
    
        if (selectedfile) {
            // binds the name of the file with the selected file itself 
            setNewProject({
                ...newproject,
                [event.target.name]: { file: selectedfile },
            });
            // Track uploaded files for display
            setUploadedFiles({
                ...uploadedFiles,
                [event.target.name]: selectedfile.name
            });
        }
    };

    // Handle plagiarism check button click
    const handleOpenPlagiarismChecker = (project) => {
        setSelectedProjectForCheck(project);
        setShowPlagiarismChecker(true);
    };

    // Handle plagiarism results button click
    const handleOpenPlagiarismResults = (project) => {
        setSelectedProjectForCheck(project);
        setShowPlagiarismResults(true);
    };

    // Handle plagiarism check completion
    const handlePlagiarismCheckComplete = (result) => {
        // Auto-refresh project data after check completes
        fetchData();
        setShowPlagiarismChecker(false);
    };

    // Handles the submission of project 
    const handleSubmitProject = async (event) =>{
        // prevents form from loading 
        event.preventDefault();

        // sets a list of requiredFields for addition check 
        const requiredFields = ["title", "description", "category", "level", "price", 
            "table_of_content", "project_content", "price"];
            
            // checks if a required field in empty 
            for (let field of requiredFields) {
                if (!newproject[field]) {
                    Toast("error", `Please provide a valid ${field.replace("_", " ")}`);
                    return;
            }
        }

        try {

            setIsLoading(true);
            
            // creates a new form object 
            const formData = new FormData();

            // append validated fields to the formData 
            formData.append("title", newproject.title);
            formData.append("category", newproject.category);
            formData.append("level", newproject.level);
            formData.append("description", newproject.description);
            formData.append("price", newproject.price);
            formData.append("table_of_content", newproject.table_of_content.file);
            formData.append("project_content", newproject.project_content.file);
            formData.append("keywords", newproject.keywords);
            formData.append("co_authors", newproject.co_authors);
            
            // API post request to submit project 
            const response = await apiInstance.post("user/project/", formData, {
                headers: { 
                    "Content-Type": "multipart/form-data", 
                    Authorization: `Bearer ${accessToken}` 
                },
            });
      
            Swal.fire({
                icon: "success",
                title: "Project submitted successfully"
            });
            
            // Clear file tracking and close modal
            setUploadedFiles({
                table_of_content: null,
                project_content: null
            });
            setShowModal(false);
            
            // reload page 
            window.location.reload()
          
        } catch (error) {
            Toast("error", error);
        } finally {
            setIsLoading(false);
        }
    }

    const itemsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const projectItems = myprojects?.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(myprojects?.length / itemsPerPage);
    const pageNumbers = Array.from({length: totalPages}, (_, index) => index + 1)

    useEffect(() =>{
        // load project and categories 
        fetchData()
    }, [])

    return (
        <>

            <main className="flex">

                <div className="w-full pt-6 px-4 md:px-8 pb-8 bg-slate-50 min-h-[calc(100vh-64px)]">
                    <div className="max-w-6xl mx-auto">
                        {/* Header with Button */}
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h1 className="text-4xl font-bold text-primary mb-2">
                                    <i className="fas fa-layer-group mr-3"></i>My Projects
                                </h1>
                                <p className="text-slate-600 text-lg">Manage and monitor your uploaded project materials</p>
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2"
                            >
                                <i className="fas fa-plus"></i> Create New Project
                            </button>
                        </div>

                        {/* Projects Table */}
                        <div className="bg-white rounded-xl border border-slate-200">
                            {isLoading ? (
                                <div className="card text-center py-12">
                                    <div className="flex justify-center mb-4">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                    </div>
                                    <p className="text-slate-600">Loading projects...</p>
                                </div>
                            ) : myprojects.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-200">
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Project Title</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Description</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                                                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Views</th>
                                                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Likes</th>
                                                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Price</th>
                                                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {projectItems?.map((project) => (
                                                    <tr key={project?.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                                        <td className="px-6 py-4">
                                                            <p className="font-semibold text-primary line-clamp-2">{project?.title}</p>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-600">
                                                            <p className="line-clamp-2">{project?.description}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                                                                project?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                                {project?.status ?? 'Pending'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="text-slate-700 font-semibold">
                                                                <i className="fas fa-eye text-info mr-1"></i>
                                                                {project?.views ?? 0}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="text-red-600 font-semibold">
                                                                <i className="fas fa-heart mr-1"></i>
                                                                {project?.like ?? 0}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <p className="text-lg font-bold text-secondary">₦{project?.price?.toLocaleString()}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button 
                                                                    className="text-primary hover:text-primary/80 font-semibold text-sm transition"
                                                                    title="Edit project"
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleOpenPlagiarismChecker(project)}
                                                                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition"
                                                                    title="Run plagiarism check"
                                                                >
                                                                    <i className="fas fa-search"></i>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleOpenPlagiarismResults(project)}
                                                                    className="text-green-600 hover:text-green-700 font-semibold text-sm transition"
                                                                    title="View plagiarism reports"
                                                                >
                                                                    <i className="fas fa-file-alt"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-2 p-6 border-t">
                                            <button 
                                                onClick={() => setCurrentPage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="px-3 py-2 rounded text-slate-600 disabled:opacity-30"
                                            >
                                                <i className="fas fa-chevron-left"></i>
                                            </button>
                                            {pageNumbers.map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`px-3 py-2 rounded font-semibold ${
                                                        currentPage === page ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            <button 
                                                onClick={() => setCurrentPage(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-2 rounded text-slate-600 disabled:opacity-30"
                                            >
                                                <i className="fas fa-chevron-right"></i>
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-16">
                                    <i className="fas fa-inbox text-6xl text-slate-300 mb-4"></i>
                                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No projects yet</h3>
                                    <p className="text-slate-600 mb-6">Start by creating your first project to share your research materials</p>
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="bg-primary text-white font-semibold py-3 px-8 rounded-lg"
                                    >
                                        <i className="fas fa-plus mr-2"></i> Create First Project
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-primary">
                                <i className="fas fa-cloud-upload-alt mr-3"></i>Upload New Project
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-500 hover:text-slate-700 text-2xl"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8">
                            <form onSubmit={handleSubmitProject} encType="multipart/form-data" className="space-y-8">
                                
                                {/* Project Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-primary mb-2">Project Title *</label>
                                    <input 
                                        type="text" 
                                        name="title" 
                                        value={newproject.title} 
                                        onChange={handleChange} 
                                        placeholder="Enter a clear, descriptive title"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Category & Level Row */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-primary mb-2">Category *</label>
                                        <select 
                                            name="category" 
                                            onChange={handleChange} 
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {category?.map((cat, index) => (
                                                <option key={index} value={cat?.id}>{cat.title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-primary mb-2">Academic Level *</label>
                                        <select 
                                            name="level" 
                                            onChange={handleChange} 
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select level</option>
                                            <option value="NCE">NCE</option>
                                            <option value="ND">ND</option>
                                            <option value="HND">HND</option>
                                            <option value="Bsc">Bsc</option>
                                            <option value="PGD">PGD</option>
                                            <option value="Msc">Msc</option>
                                            <option value="PhD">PhD</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-primary mb-2">Description *</label>
                                    <textarea 
                                        name="description" 
                                        value={newproject.description} 
                                        onChange={handleChange} 
                                        placeholder="Provide a detailed description of your project materials"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                        rows="4"
                                        required
                                    ></textarea>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-slate-200"></div>

                                {/* File Uploads */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-primary">
                                        <i className="fas fa-file-upload mr-2"></i> Upload Project Files
                                    </h3>
                                    
                                    {/* Table of Content */}
                                    <div>
                                        <label className="block text-sm font-semibold text-primary mb-3">Table of Content *</label>
                                        <input 
                                            type="file" 
                                            name="table_of_content" 
                                            onChange={handleFileChange}
                                            className="sr-only"
                                            id="table_of_content"
                                            required
                                        />
                                        <label htmlFor="table_of_content" className={`flex items-center justify-center gap-3 p-6 border-2 border-dashed rounded-lg cursor-pointer transition ${
                                            uploadedFiles.table_of_content 
                                                ? 'border-green-300 bg-green-50' 
                                                : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                                        }`}>
                                            <div className="text-center">
                                                {uploadedFiles.table_of_content ? (
                                                    <>
                                                        <i className="fas fa-check-circle text-3xl text-green-600 mb-2 block"></i>
                                                        <p className="font-semibold text-green-700">{uploadedFiles.table_of_content}</p>
                                                        <p className="text-xs text-green-600 mt-1">File selected</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-file-pdf text-3xl text-primary mb-2 block"></i>
                                                        <p className="font-semibold text-slate-700">Click to upload Table of Content</p>
                                                        <p className="text-sm text-slate-500 mt-1">PDF or DOC files</p>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    </div>

                                    {/* Project Content */}
                                    <div>
                                        <label className="block text-sm font-semibold text-primary mb-3">Project Content *</label>
                                        <input 
                                            type="file" 
                                            name="project_content" 
                                            onChange={handleFileChange}
                                            className="sr-only"
                                            id="project_content"
                                            required
                                        />
                                        <label htmlFor="project_content" className={`flex items-center justify-center gap-3 p-6 border-2 border-dashed rounded-lg cursor-pointer transition ${
                                            uploadedFiles.project_content 
                                                ? 'border-green-300 bg-green-50' 
                                                : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                                        }`}>
                                            <div className="text-center">
                                                {uploadedFiles.project_content ? (
                                                    <>
                                                        <i className="fas fa-check-circle text-3xl text-green-600 mb-2 block"></i>
                                                        <p className="font-semibold text-green-700">{uploadedFiles.project_content}</p>
                                                        <p className="text-xs text-green-600 mt-1">File selected</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-file-pdf text-3xl text-primary mb-2 block"></i>
                                                        <p className="font-semibold text-slate-700">Click to upload Project Content</p>
                                                        <p className="text-sm text-slate-500 mt-1">PDF or ZIP files</p>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-slate-200"></div>

                                {/* Pricing & Details */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-primary">
                                        <i className="fas fa-tag mr-2"></i> Pricing & Additional Details
                                    </h3>
                                    
                                    <div>
                                        <label className="block text-sm font-semibold text-primary mb-2">Price (₦) *</label>
                                        <input 
                                            type="number" 
                                            name="price" 
                                            value={newproject.price} 
                                            onChange={handleChange} 
                                            placeholder="Set your project price"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-primary mb-2">Keywords</label>
                                            <input 
                                                type="text" 
                                                name="keywords" 
                                                value={newproject.keywords} 
                                                onChange={handleChange} 
                                                placeholder="e.g., research, analysis, data science"
                                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-primary mb-2">Co-Authors</label>
                                            <input 
                                                type="text" 
                                                name="co_authors" 
                                                value={newproject.co_authors} 
                                                onChange={handleChange} 
                                                placeholder="Names of other authors (optional)"
                                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-4 pt-8 border-t border-slate-200">
                                    <button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin"></i> Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-cloud-upload-alt"></i> Upload Project
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setNewProject({
                                                title: "",
                                                category: parseInt(""),
                                                description: "",
                                                level: "",
                                                price: "",
                                                keywords: "",
                                                co_authors: "",
                                                table_of_content: null,
                                                project_content: null,
                                            });
                                            setUploadedFiles({
                                                table_of_content: null,
                                                project_content: null
                                            });
                                            setShowModal(false);
                                        }}
                                        className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Plagiarism Checker Modal */}
            {showPlagiarismChecker && selectedProjectForCheck && (
                <PlagiarismChecker
                    projectId={selectedProjectForCheck.id}
                    projectTitle={selectedProjectForCheck.title}
                    onCheckComplete={handlePlagiarismCheckComplete}
                    onClose={() => {
                        setShowPlagiarismChecker(false);
                        setSelectedProjectForCheck(null);
                    }}
                />
            )}

            {/* Plagiarism Results Modal */}
            {showPlagiarismResults && selectedProjectForCheck && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
                        <div className="p-8">
                            <PlagiarismResults
                                projectId={selectedProjectForCheck.id}
                                onClose={() => {
                                    setShowPlagiarismResults(false);
                                    setSelectedProjectForCheck(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Projects
            
            