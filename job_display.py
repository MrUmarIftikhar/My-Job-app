import json

def load_job_listings(file_path):
    """Load job listings from a JSON file."""
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def filter_by_category(job_listings, category):
    """Filter job listings by job category."""
    return [job for job in job_listings['results'] if job['job_category'] == category]

def filter_by_salary(job_listings, min_salary, max_salary):
    """Filter job listings by salary range."""
    filtered_jobs = []
    for job in job_listings['results']:
        salary = job['primary_details']['Salary']
        if salary != "-" and "₹" in salary:
            salary_value = int(salary.split("₹")[1].split("-")[0].replace(",", "").strip())
            if min_salary <= salary_value <= max_salary:
                filtered_jobs.append(job)
    return filtered_jobs

def filter_by_experience(job_listings, experience):
    """Filter job listings by experience level."""
    return [job for job in job_listings['results'] if job['primary_details']['Experience'] == experience]

def display_job_listings(job_listings):
    """Display job listings in a user-friendly format."""
    for job in job_listings:
        print(f"Job Title: {job['title']}")
        print(f"Company: {job['company_name']}")
        print(f"Location: {job['primary_details']['Place']}")
        print(f"Salary: {job['primary_details']['Salary']}")
        print(f"Job Type: {job['primary_details']['Job_Type']}")
        print(f"Experience Required: {job['primary_details']['Experience']}")
        print(f"Qualification: {job['primary_details']['Qualification']}")
        print(f"Category: {job['job_category']}")
        print(f"Contact via WhatsApp: {job['contact_preference']['whatsapp_link']}")
        print("-" * 40)

if __name__ == "__main__":
    job_listings = load_job_listings('job_listings.json')
    # Example usage of filtering
    filtered_jobs = filter_by_category(job_listings, "Medical/ Doctor")
    display_job_listings(filtered_jobs)
