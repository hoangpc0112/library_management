import { useEffect } from "react";

const ProfilePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Giới Thiệu Thư Viện PTIT";
  }, []);

  return (
    <section className="py-3 py-md-5 py-xl-8">
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6">
            <h2 className="mb-4 display-5 text-center">Hồ sơ</h2>
            <p className="text-secondary text-center lead fs-4 mb-5">
              The Profile page is your digital hub, where you can fine-tune your
              experience. Here's a closer look at the settings you can expect to
              find in your profile page.
            </p>
            <hr className="w-50 mx-auto mb-5 mb-xl-9 border-dark-subtle" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
