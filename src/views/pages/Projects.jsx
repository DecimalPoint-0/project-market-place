import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useParams } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import apiInstance from "../../utils/axios";

function Projects() {

    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [filterLevel, setFilterLevel] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    
    const param = useParams();
    const itemsPerPage = 20;

    const fetchProjects = async () => {
        try{
            setIsLoading(true);
            let url = '';
            
            // If category ID is provided, fetch category projects, otherwise fetch all projects
            if (param.id) {
                url = `category/${param.id}/projects`;
            } else {
                url = 'projects/all';
            }
            
            const response = await apiInstance.get(url);
            const projectList = response.data.results || response.data || [];
            setProjects(projectList);
            setFilteredProjects(projectList);
            setCurrentPage(1);
        }catch(error){
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        const filtered = projects.filter(project =>
            project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (project.author_name && project.author_name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredProjects(filtered);
        setCurrentPage(1);
    };

    const handleLevelFilter = (level) => {
        setFilterLevel(level);
        setCurrentPage(1);
        
        let filtered = projects;
        
        if (level !== "") {
            filtered = projects.filter(project => project.level === level);
        }
        
        // Apply search term if it exists
        if (searchTerm !== "") {
            filtered = filtered.filter(project =>
                project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (project.author_name && project.author_name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        
        setFilteredProjects(filtered);
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProjects = filteredProjects.slice(startIndex, endIndex);

    const handleClearFilters = () => {
        setFilterLevel("");
        setSearchTerm("");
        setCurrentPage(1);
        setFilteredProjects(projects);
    };

    useEffect(() => {
        fetchProjects()
    }, [param.id])

    return (
        <>
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-primary text-light py-12 px-8">
                <div className="container max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">
                        {param.id ? "Category Projects" : "All Projects"}
                    </h1>
                    <p className="text-slate-300">Discover quality project materials tailored to your academic needs</p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 px-8 bg-slate-50">
                <div className="container max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                        {/* Sidebar - Filters */}
                        <div className="md:col-span-1">
                            <div className="card sticky top-24">
                                <h3 className="text-xl font-bold text-primary mb-6">
                                    <i className="fas fa-filter mr-2"></i> Filters
                                </h3>
                                
                                <div className="mb-6">
                                    <h4 className="form-label">Project Level</h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="level" 
                                                value=""
                                                checked={filterLevel === ""}
                                                onChange={(e) => handleLevelFilter(e.target.value)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-slate-700">All Levels</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="level" 
                                                value="NCE"
                                                checked={filterLevel === "NCE"}
                                                onChange={(e) => handleLevelFilter(e.target.value)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-slate-700">NCE</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="level" 
                                                value="ND"
                                                checked={filterLevel === "ND"}
                                                onChange={(e) => handleLevelFilter(e.target.value)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-slate-700">ND</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="level" 
                                                value="HND"
                                                checked={filterLevel === "HND"}
                                                onChange={(e) => handleLevelFilter(e.target.value)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-slate-700">HND</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="level" 
                                                value="BSc"
                                                checked={filterLevel === "BSc"}
                                                onChange={(e) => handleLevelFilter(e.target.value)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-slate-700">BSc</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="level" 
                                                value="MSc"
                                                checked={filterLevel === "MSc"}
                                                onChange={(e) => handleLevelFilter(e.target.value)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-slate-700">MSc</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="level" 
                                                value="PGD"
                                                checked={filterLevel === "PGD"}
                                                onChange={(e) => handleLevelFilter(e.target.value)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-slate-700">PGD</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="level" 
                                                value="PhD"
                                                checked={filterLevel === "PhD"}
                                                onChange={(e) => handleLevelFilter(e.target.value)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-slate-700">PhD</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="level" 
                                                value="Others"
                                                checked={filterLevel === "Others"}
                                                onChange={(e) => handleLevelFilter(e.target.value)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-slate-700">Others</span>
                                        </label>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleClearFilters}
                                    className="btn-outline w-full py-2"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>

                        {/* Main Content - Projects */}
                        <div className="md:col-span-3">
                            {/* Search Bar */}
                            <div className="card mb-8">
                                <form onSubmit={handleSearch} className="flex gap-2">
                                    <input 
                                        type="text" 
                                        name="search" 
                                        placeholder="Search by project title or author..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="form-input flex-1"
                                    />
                                    <button type="submit" className="btn px-6">
                                        <i className="fas fa-search"></i> Search
                                    </button>
                                </form>
                            </div>

                            {/* Results Count and Pagination Info */}
                            <div className="mb-6 flex items-center justify-between">
                                <p className="text-slate-600">
                                    Showing <strong>{startIndex + 1}-{Math.min(endIndex, filteredProjects.length)}</strong> of <strong>{filteredProjects.length}</strong> project(s)
                                </p>
                                <p className="text-slate-600 text-sm">
                                    Page <strong>{currentPage}</strong> of <strong>{totalPages || 1}</strong>
                                </p>
                            </div>

                            {/* Projects Grid */}
                            {isLoading ? (
                                <div className="card text-center py-12">
                                    <div className="flex justify-center mb-4">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                    </div>
                                    <p className="text-slate-600">Loading projects...</p>
                                </div>
                            ) : currentProjects.length > 0 ? (
                                <>
                                    <div className="grid gap-6">
                                        {currentProjects.map((project) => (
                                            <Link 
                                                key={project?.id}
                                                to={`/projects/${project?.id}`}
                                                className="card overflow-hidden"
                                            >
                                                <div className="flex gap-6">
                                                    {/* Project Icon */}
                                                    <div className="flex-shrink-0 w-20 h-20 bg-gradient-primary rounded-lg flex items-center justify-center text-light text-3xl">
                                                        <i className="fas fa-file-pdf"></i>
                                                    </div>

                                                    {/* Project Info */}
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-primary mb-2">
                                                            {project?.title}
                                                        </h3>
                                                        
                                                        <p className="text-slate-600 text-sm mb-3">
                                                            By <strong>{project?.author_name}</strong>
                                                        </p>

                                                        <div className="flex flex-wrap gap-3 items-center text-sm">
                                                            <span className="badge badge-primary">
                                                                <i className="fas fa-layer-group mr-1"></i> Level {project?.level}
                                                            </span>
                                                            <span className="text-slate-600">
                                                                <i className="fas fa-heart text-red-500 mr-1"></i>
                                                                {project?.like ?? 0} Likes
                                                            </span>
                                                            <span className="text-slate-600">
                                                                <i className="fas fa-eye text-info mr-1"></i>
                                                                {project?.views ?? 0} Views
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Price and Action */}
                                                    <div className="flex flex-col items-end justify-between min-w-fit">
                                                        <div className="text-right">
                                                            <p className="text-slate-600 text-sm">Price</p>
                                                            <p className="text-2xl font-bold text-secondary">
                                                                ₦{project?.price?.toLocaleString() ?? '0'}
                                                            </p>
                                                        </div>
                                                        <button className="btn px-4 py-2 text-sm whitespace-nowrap">
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="mt-8 flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                                className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <i className="fas fa-chevron-left mr-2"></i>Previous
                                            </button>

                                            <div className="flex gap-2">
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`px-3 py-2 rounded-lg ${
                                                            currentPage === page
                                                                ? 'bg-primary text-white'
                                                                : 'border border-slate-300'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={currentPage === totalPages}
                                                className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next<i className="fas fa-chevron-right ml-2"></i>
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="card text-center py-12">
                                    <i className="fas fa-search text-6xl text-slate-300 mb-4"></i>
                                    <h3 className="text-2xl font-bold text-slate-600 mb-2">No Projects Found</h3>
                                    <p className="text-slate-500">Try adjusting your filters or search terms</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

        </>
    );

}

export default Projects;

    